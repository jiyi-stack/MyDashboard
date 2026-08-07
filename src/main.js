// ========================================
// 星河浅滩 — Main Entry Point
// ========================================
import './css/main.css';
import { appData, appSettings, defaultData, loadDataLocal, saveDataLocal, loadSettingsLocal, saveSettingsLocal, apiFetch, initData, saveAll, fullPushToServer, fullPullFromServer, setServerUrl } from './js/data.js';
import { getToday } from './js/utils.js';
import { navigateTo, showToast, exportData as exportDataFn, importDataFile } from './js/ui-framework.js';

import { renderDashboard } from './js/modules/dashboard.js';
import { renderPlans, openPlanModal, updatePlanStatus, deletePlan, togglePlanMenu, closeAllPlanMenus } from './js/modules/plans.js';
import { renderAutoTasks, checkinTask, openAutoTaskModal, deleteAutoTask, checkDueTasks, toggleTaskEnabled } from './js/modules/autotasks.js';
import { renderLearning, openLearningModal, deleteLearning } from './js/modules/learning.js';
import { renderHabits, updateHabitRating, openHabitModal, deleteHabit } from './js/modules/habits.js';
import { renderFinance, openFinanceModal, deleteFinance, openQuickFinanceModal, toggleFinanceCharts } from './js/modules/finance.js';
import { iconHTML } from './js/icons.js';
import { renderSettings } from './js/modules/settings.js';

// ── State ──
let currentView = 'dashboard';
let currentMonth = getToday().slice(0, 7);
let habitFilter = '全部';
let LocalNotifications = null;

// ── Mobile Nav 菜单配置（后续新增菜单只需在此追加一项）──
const MOBILE_MENUS = [
  { view: 'dashboard', label: '看板', full: '数据看板', icon: 'dashboard' },
  { view: 'plans',     label: '计划', full: '计划清单', icon: 'clipboard-list' },
  { view: 'autotasks', label: '任务', full: '定时任务', icon: 'clock' },
  { view: 'learning',  label: '学习', full: '学习记录', icon: 'book-open' },
  { view: 'habits',    label: '习惯', full: '习惯追踪', icon: 'sprout' },
  { view: 'finance',   label: '记账', full: '记账账本', icon: 'wallet' },
  { view: 'settings',  label: '设置', full: '设置中心', icon: 'settings' },
];

// ── Render ──
function renderCurrentView() {
  const container = document.getElementById('mainContent');
  if (!container) return;
  container.innerHTML = '';
  container.scrollTop = 0;
  switch (currentView) {
    case 'dashboard': renderDashboard(container, appData); break;
    case 'plans': renderPlans(container, appData, saveAll, currentMonth); break;
    case 'autotasks': renderAutoTasks(container, appData, saveAll, currentMonth); break;
    case 'learning': renderLearning(container, appData, saveAll, currentMonth); break;
    case 'habits': renderHabits(container, appData, saveAll, habitFilter); break;
    case 'finance': renderFinance(container, appData, saveAll, currentMonth); break;
    case 'settings': renderSettings(container, appData, appSettings, saveAll, saveSettingsLocal, renderCurrentView); break;
  }
}

// ── Navigation ──
function doNavigate(view) {
  currentView = view;
  document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  closeMoreSheet();
  // 移动端底部导航自动滚动到当前 Tab（inline 居中，不触发页面纵向滚动）
  const activeTab = document.querySelector(`.mobile-nav-item[data-view="${view}"]`);
  if (activeTab) {
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  const [title, sub] = {dashboard:['数据看板',''],plans:['计划清单','管理你的待办计划'],autotasks:['定时任务','自动化日常事务管控'],learning:['学习记录','记录每一次成长'],habits:['习惯追踪','培养好习惯，改善坏习惯'],finance:['记账账本','理性消费，心中有数'],settings:['设置中心','个性化配置']}[view]||['',''];
  document.getElementById('headerTitle').textContent = title;
  document.getElementById('headerSub').textContent = sub;
  const actBtn = document.getElementById('headerAction');
  const mainHeader = document.getElementById('mainHeader');
  const noHeaderViews = ['dashboard', 'plans', 'autotasks', 'habits', 'finance', 'settings', 'learning'];
  if (noHeaderViews.includes(view)) {
    mainHeader.style.display = 'none';
  } else {
    mainHeader.style.display = 'flex';
  }
  actBtn.style.display = 'none';
  actBtn.className = 'btn btn-primary btn-sm';
  renderCurrentView();
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function openAddModal(view) {
  const map = { plans: openPlanModal, autotasks: openAutoTaskModal, learning: openLearningModal, habits: openHabitModal, finance: openFinanceModal };
  if (map[view]) map[view](null, appData, saveAll, renderCurrentView);
}

// ── Mobile Bottom Nav（左侧 Tab 可横向滚动，右侧「更多」固定）──
function renderMobileNav() {
  const nav = document.getElementById('mobileBottomNav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="mobile-nav-scroll">
      ${MOBILE_MENUS.map(item => `
        <button class="mobile-nav-item" data-view="${item.view}">
          ${iconHTML(item.icon, { size: 22 })}
          <span>${item.label}</span>
        </button>`).join('')}
    </div>
    <button class="mobile-nav-item more-btn">
      ${iconHTML('more-horizontal', { size: 22 })}
      <span>更多</span>
    </button>`;
  nav.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => doNavigate(el.dataset.view)));
  nav.querySelector('.more-btn')?.addEventListener('click', () => toggleMoreSheet(true));
}

// ── 「更多」底部弹层（收纳全部菜单，含常驻 Tab，当前页高亮）──
function toggleMoreSheet(open) {
  const overlay = document.getElementById('moreSheetOverlay');
  if (!overlay) {
    const el = document.createElement('div');
    el.id = 'moreSheetOverlay';
    el.className = 'more-sheet-overlay';
    el.innerHTML = `
      <div class="more-sheet">
        <div class="more-sheet-handle"></div>
        <div class="more-sheet-header">
          <div class="more-sheet-title">全部功能</div>
          <button class="more-sheet-close">${iconHTML('x', { size: 18 })}</button>
        </div>
        <div class="more-sheet-grid" id="moreSheetGrid"></div>
      </div>`;
    el.addEventListener('click', (e) => { if (e.target === el) closeMoreSheet(); });
    el.querySelector('.more-sheet-close').addEventListener('click', closeMoreSheet);
    document.body.appendChild(el);
  }
  const grid = overlay.querySelector('#moreSheetGrid');
  grid.innerHTML = MOBILE_MENUS.map(m => `
    <button class="more-sheet-cell ${currentView === m.view ? 'active' : ''}" data-view="${m.view}">
      <span class="more-sheet-icon">${iconHTML(m.icon, { size: 22 })}</span>
      <span class="more-sheet-label">${m.full}</span>
    </button>`).join('');
  grid.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', () => { closeMoreSheet(); doNavigate(el.dataset.view); });
  });
  document.querySelector('.more-btn')?.classList.toggle('active', !!open);
  overlay.classList.toggle('show', !!open);
}

function closeMoreSheet() {
  const overlay = document.getElementById('moreSheetOverlay');
  if (overlay) overlay.classList.remove('show');
  document.querySelector('.more-btn')?.classList.remove('active');
}

// ── Sync ──
function startPeriodicSync() {
  setInterval(async () => {
    if (!appSettings.autoSync) return;
    await fullPushToServer();
    const pulled = await fullPullFromServer();
    if (pulled) {
      saveDataLocal(appData);
      if (!document.querySelector('.modal-overlay')) renderCurrentView();
    }
  }, 30000);
}

// ── Task checker ──
function startTaskChecker() {
  setInterval(() => {
    checkDueTasks(appData, appSettings, saveAll, currentView === 'autotasks' ? renderCurrentView : null, showToast, LocalNotifications);
  }, 30000);
  checkDueTasks(appData, appSettings, saveAll, null, showToast, LocalNotifications);
}

// ── Init ──
async function init() {
  console.log('INIT START');

  // 设置导航事件
  document.querySelectorAll('.sidebar-nav-item').forEach(el => el.addEventListener('click', () => doNavigate(el.dataset.view)));
  renderMobileNav();

  // 移动端菜单
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const checkMobile = () => window.innerWidth <= 768;
  menuBtn.style.display = checkMobile() ? 'flex' : 'none';
  window.addEventListener('resize', () => { menuBtn.style.display = checkMobile() ? 'flex' : 'none'; });
  menuBtn.addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('show'); });
  overlay.addEventListener('click', () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); });

  // 挂载全局函数
  window._navigateTo = doNavigate;
  window._renderCurrentView = renderCurrentView;
  window._filterPlans = (s) => { document.getElementById('mainContent').dataset.filterStatus = s; renderCurrentView(); };
  window._filterPlansMonth = (m) => { currentMonth = m || getToday().slice(0, 7); renderCurrentView(); };
  window._filterTasksMonth = (m) => { currentMonth = m; renderCurrentView(); };
  window._filterLearnMonth = (m) => { currentMonth = m; renderCurrentView(); };
  window._filterFinMonth = (m) => { currentMonth = m; renderCurrentView(); };
  window._filterHabitType = (t) => { habitFilter = t; renderCurrentView(); };
  window._openAddModal = openAddModal;
  window._openPlanModal = (id) => openPlanModal(id, appData, saveAll, renderCurrentView);
  window._updatePlanStatus = (id, s) => { closeAllPlanMenus(); updatePlanStatus(id, s, appData, saveAll, renderCurrentView); };
  window._deletePlan = (id) => { closeAllPlanMenus(); deletePlan(id, appData, saveAll, renderCurrentView); };
  window._togglePlanMenu = (id) => togglePlanMenu(id);
  window._checkinTask = (id) => checkinTask(id, appData, saveAll, renderCurrentView);
  window._openAutoTaskModal = (id) => openAutoTaskModal(id, appData, saveAll, renderCurrentView);
  window._deleteAutoTask = (id) => deleteAutoTask(id, appData, saveAll, renderCurrentView);
  window._toggleTaskEnabled = (id) => toggleTaskEnabled(id, appData, saveAll, renderCurrentView);
  window._openLearningModal = (id) => openLearningModal(id, appData, saveAll, renderCurrentView);
  window._deleteLearning = (id) => deleteLearning(id, appData, saveAll, renderCurrentView);
  window._updateHabitRating = (id, r) => updateHabitRating(id, r, appData, saveAll, renderCurrentView);
  window._openHabitModal = (id) => openHabitModal(id, appData, saveAll, renderCurrentView);
  window._deleteHabit = (id) => deleteHabit(id, appData, saveAll, renderCurrentView);
  window._openFinanceModal = (id) => openFinanceModal(id, appData, saveAll, renderCurrentView);
  window._openQuickFinanceModal = (type, cat) => openQuickFinanceModal(type, cat, appData, saveAll, renderCurrentView);
  window._deleteFinance = (id) => deleteFinance(id, appData, saveAll, renderCurrentView);
  window._toggleFinanceCharts = () => toggleFinanceCharts();
  window._exportData = () => exportDataFn(appData);
  window._importDataFile = (file) => importDataFile(file, appData, saveAll, renderCurrentView);
  window._syncPush = async () => { const ok = await fullPushToServer(); showToast(ok ? '本地数据已上传到服务器' : '无法连接服务器，数据已保存在本地', ok ? 'success' : 'warning', 'cloud'); };
  window._syncPull = async () => { const ok = await fullPullFromServer(); if (ok) { saveDataLocal(appData); renderCurrentView(); showToast('数据已从服务器同步', 'success', 'cloud'); } else showToast('无法连接服务器', 'warning'); };
  window._saveServerUrl = (url) => setServerUrl(url);
  window._testServerConnection = async (url) => {
    try {
      const base = String(url).trim().replace(/\/+$/, '');
      const api = base.endsWith('/api') ? base : base + '/api';
      const res = await fetch(api + '/health', { headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) return false;
      const data = await res.json();
      return !!data.ok;
    } catch { return false; }
  };
  window._resetAllData = () => { Object.assign(appData, JSON.parse(JSON.stringify(defaultData))); saveAll(); renderCurrentView(); showToast('数据已重置为初始状态', 'warning'); };

  // 初始化数据
  console.log('Initiating data sync...');
  const syncStatus = await initData();
  console.log('Sync result:', syncStatus);
  showToast(syncStatus === 'synced' ? '已从服务器同步数据' : '离线模式 · 数据保存在本地', 'info', syncStatus === 'synced' ? 'cloud' : 'smartphone');

  // 监听 localStorage 保存失败事件
  window.addEventListener('save-failed', (e) => {
    showToast('数据保存失败！存储空间可能不足，请导出数据备份后清理旧记录', 'warning');
  });

  // Capacitor（后台加载，不阻塞）
  setTimeout(() => {
    import('@capacitor/local-notifications').then(mod => {
      LocalNotifications = mod.LocalNotifications;
      mod.LocalNotifications.requestPermissions().catch(() => {});
    }).catch(() => {});
  }, 500);

  // Browser notifications
  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      Notification.requestPermission().catch(() => {});
    }, 2000);
  }

  // 渲染首页
  currentMonth = getToday().slice(0, 7);
  doNavigate('dashboard');
  console.log('INIT COMPLETE, mainContent length:', document.getElementById('mainContent').innerHTML.length);

  // 全局点击关闭下拉菜单
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      closeAllPlanMenus();
    }
  });

  // 启动后台任务
  startPeriodicSync();
  startTaskChecker();
}

console.log('main.js module loaded, registering DOMContentLoaded');
document.addEventListener('DOMContentLoaded', init);
