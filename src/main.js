// ========================================
// 个人全能工作台 — Main Entry Point
// ========================================
import './css/main.css';
import { appData, appSettings, defaultData, loadDataLocal, saveDataLocal, loadSettingsLocal, saveSettingsLocal, apiFetch, initData, saveAll, fullPushToServer, fullPullFromServer } from './js/data.js';
import { getToday } from './js/utils.js';
import { navigateTo, showToast, exportData as exportDataFn, importDataFile } from './js/ui-framework.js';

import { renderDashboard } from './js/modules/dashboard.js';
import { renderPlans, openPlanModal, updatePlanStatus, deletePlan } from './js/modules/plans.js';
import { renderAutoTasks, checkinTask, openAutoTaskModal, deleteAutoTask, checkDueTasks } from './js/modules/autotasks.js';
import { renderLearning, openLearningModal } from './js/modules/learning.js';
import { renderHabits, updateHabitRating, openHabitModal, deleteHabit } from './js/modules/habits.js';
import { renderFinance, openFinanceModal, deleteFinance } from './js/modules/finance.js';
import { renderSettings } from './js/modules/settings.js';

// ── State ──
let currentView = 'dashboard';
let currentMonth = getToday().slice(0, 7);
let habitFilter = '全部';
let LocalNotifications = null;

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
  document.querySelectorAll('.sidebar-nav-item,.mobile-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  const [title, sub] = {dashboard:['数据看板',''],plans:['计划清单','管理你的待办计划'],autotasks:['定时任务','自动化日常事务管控'],learning:['学习记录','记录每一次成长'],habits:['习惯追踪','培养好习惯，改善坏习惯'],finance:['记账账本','理性消费，心中有数'],settings:['设置中心','个性化配置']}[view]||['',''];
  document.getElementById('headerTitle').textContent = title;
  document.getElementById('headerSub').textContent = sub;
  const actBtn = document.getElementById('headerAction');
  if (['plans','autotasks','learning','habits','finance'].includes(view)) {
    actBtn.style.display = 'inline-flex';
    actBtn.textContent = '＋ 新增';
    actBtn.onclick = () => openAddModal(view);
  } else { actBtn.style.display = 'none'; }
  renderCurrentView();
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

function openAddModal(view) {
  const map = { plans: openPlanModal, autotasks: openAutoTaskModal, learning: openLearningModal, habits: openHabitModal, finance: openFinanceModal };
  if (map[view]) map[view](null, appData, saveAll, renderCurrentView);
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
  document.querySelectorAll('.mobile-nav-item').forEach(el => el.addEventListener('click', () => doNavigate(el.dataset.view)));

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
  window._updatePlanStatus = (id, s) => updatePlanStatus(id, s, appData, saveAll, renderCurrentView);
  window._deletePlan = (id) => deletePlan(id, appData, saveAll, renderCurrentView);
  window._checkinTask = (id) => checkinTask(id, appData, saveAll, renderCurrentView);
  window._openAutoTaskModal = (id) => openAutoTaskModal(id, appData, saveAll, renderCurrentView);
  window._deleteAutoTask = (id) => deleteAutoTask(id, appData, saveAll, renderCurrentView);
  window._openLearningModal = (id) => openLearningModal(id, appData, saveAll, renderCurrentView);
  window._updateHabitRating = (id, r) => updateHabitRating(id, r, appData, saveAll, renderCurrentView);
  window._openHabitModal = (id) => openHabitModal(id, appData, saveAll, renderCurrentView);
  window._deleteHabit = (id) => deleteHabit(id, appData, saveAll, renderCurrentView);
  window._openFinanceModal = (id) => openFinanceModal(id, appData, saveAll, renderCurrentView);
  window._deleteFinance = (id) => deleteFinance(id, appData, saveAll, renderCurrentView);
  window._exportData = () => exportDataFn(appData);
  window._importDataFile = (file) => importDataFile(file, appData, saveAll, renderCurrentView);
  window._syncPush = async () => { const ok = await fullPushToServer(); showToast(ok ? '本地数据已上传到服务器' : '无法连接服务器，数据已保存在本地', ok ? 'success' : 'warning', '☁️'); };
  window._syncPull = async () => { const ok = await fullPullFromServer(); if (ok) { saveDataLocal(appData); renderCurrentView(); showToast('数据已从服务器同步', 'success', '☁️'); } else showToast('无法连接服务器', 'warning'); };
  window._resetAllData = () => { Object.assign(appData, JSON.parse(JSON.stringify(defaultData))); saveAll(); renderCurrentView(); showToast('数据已重置为初始状态', 'warning'); };

  // 初始化数据
  console.log('Initiating data sync...');
  const syncStatus = await initData();
  console.log('Sync result:', syncStatus);
  showToast(syncStatus === 'synced' ? '已从服务器同步数据' : '离线模式 · 数据保存在本地', 'info', syncStatus === 'synced' ? '☁️' : '📱');

  // Capacitor（后台加载，不阻塞）
  setTimeout(() => {
    import('@capacitor/local-notifications').then(mod => {
      LocalNotifications = mod.LocalNotifications;
      mod.LocalNotifications.requestPermissions().catch(() => {});
    }).catch(() => {});
  }, 500);

  // 渲染首页
  currentMonth = getToday().slice(0, 7);
  doNavigate('dashboard');
  console.log('INIT COMPLETE, mainContent length:', document.getElementById('mainContent').innerHTML.length);

  // 启动后台任务
  startPeriodicSync();
  startTaskChecker();
}

console.log('main.js module loaded, registering DOMContentLoaded');
document.addEventListener('DOMContentLoaded', init);
