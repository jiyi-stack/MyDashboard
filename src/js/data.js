// ========================================
// DATA LAYER — API client + local fallback + smart merge
// ========================================

const STORAGE_KEY = 'mydashboard_data';
const SETTINGS_KEY = 'mydashboard_settings';
// 记录最后一次同步时间戳的 key
const LAST_SYNC_KEY = 'mydashboard_last_sync';
// 记录离线期间修改过的条目 ID（以便回家后只推送变化的部分）
const PENDING_CHANGES_KEY = 'mydashboard_pending_changes';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ? '/api' : (window.location.origin + '/api');

// Default seed data
const defaultData = {
  plans: [
    { id:'p1', name:'完成需求文档评审', detail:'与团队对齐PRD所有功能点', deadline:'2026-08-10', status:'未完成', note:'', createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'p2', name:'搭建项目框架', detail:'初始化前端工程、配置构建工具', deadline:'2026-08-05', status:'已完成', note:'', createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'p3', name:'学习React状态管理', detail:'深入学习Zustand和Jotai', deadline:'2026-07-20', status:'拖延中', note:'需重新安排时间', createdAt:'2026-07-10', updatedAt:'2026-07-10' }
  ],
  autotasks: [
    { id:'at1', name:'工作日日志提醒', description:'每天记录工作日志', scheduleType:'weekday', scheduleTime:'17:00', scheduleDays:'', scheduleDate:'', status:'未完成', completedDates:[], createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'at2', name:'工作日上班打卡', description:'确认到岗开始工作', scheduleType:'weekday', scheduleTime:'09:00', scheduleDays:'', scheduleDate:'', status:'未完成', completedDates:[], createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'at3', name:'每日喝水提醒', description:'记得补充水分', scheduleType:'daily', scheduleTime:'10:00', scheduleDays:'', scheduleDate:'', status:'未完成', completedDates:[], createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'at4', name:'三日浇花提醒', description:'给植物浇水', scheduleType:'interval', scheduleTime:'08:00', scheduleDays:'3', scheduleDate:'', status:'未完成', completedDates:[], createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'at5', name:'每晚二胡练习', description:'练习二胡30分钟', scheduleType:'daily', scheduleTime:'20:00', scheduleDays:'', scheduleDate:'', status:'未完成', completedDates:[], createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'at6', name:'每晚11点睡觉', description:'保持规律作息', scheduleType:'daily', scheduleTime:'23:00', scheduleDays:'', scheduleDate:'', status:'未完成', completedDates:[], createdAt:'2026-08-01', updatedAt:'2026-08-01' }
  ],
  learning: [
    { id:'l1', topic:'Zustand状态管理', content:'学习了Zustand的基本用法，包括create、set、get等API', result:'完成了一个Todo应用的demo', studyTime:'2026-08-03', images:[], note:'需要继续深入', createdAt:'2026-08-03', updatedAt:'2026-08-03' }
  ],
  habits: [
    { id:'h1', name:'每日阅读', type:'正向', rating:4, record:'坚持每天阅读30分钟', note:'继续保持', createdAt:'2026-08-01', updatedAt:'2026-08-01' },
    { id:'h2', name:'熬夜', type:'负面', rating:2, record:'最近有所改善，但偶尔还是会熬夜', note:'目标是完全戒掉', createdAt:'2026-08-01', updatedAt:'2026-08-01' }
  ],
  finance: [
    { id:'f1', type:'支出', category:'餐饮', amount:35, date:'2026-08-03', scene:'午餐外卖', note:'', image:'', createdAt:'2026-08-03', updatedAt:'2026-08-03' },
    { id:'f2', type:'支出', category:'交通', amount:12, date:'2026-08-03', scene:'地铁通勤', note:'', image:'', createdAt:'2026-08-03', updatedAt:'2026-08-03' },
    { id:'f3', type:'收入', category:'工资', amount:15000, date:'2026-08-01', scene:'8月工资', note:'', image:'', createdAt:'2026-08-01', updatedAt:'2026-08-01' }
  ]
};

const defaultSettings = { notifications:true, theme:'light', autoSync:true, reminderVolume:70 };

// ── localStorage helpers ──
function loadDataLocal() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      try { return JSON.parse(d); } catch (e2) { /* corrupt data — use default */ }
    }
    return JSON.parse(JSON.stringify(defaultData));
  } catch (e) { return JSON.parse(JSON.stringify(defaultData)); }
}
function saveDataLocal(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function loadSettingsLocal() {
  try { const s = localStorage.getItem(SETTINGS_KEY); return s ? JSON.parse(s) : { ...defaultSettings }; }
  catch (e) { return { ...defaultSettings }; }
}
function saveSettingsLocal(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

// ── Pending changes tracking (offline-first) ──
function getPendingChanges() {
  try { return JSON.parse(localStorage.getItem(PENDING_CHANGES_KEY) || '{}'); }
  catch { return {}; }
}
function addPendingChange(module, id) {
  const pending = getPendingChanges();
  if (!pending[module]) pending[module] = {};
  pending[module][id] = true;
  localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pending));
}
function clearPendingChanges() {
  localStorage.removeItem(PENDING_CHANGES_KEY);
}
function getLastSyncTime() {
  return localStorage.getItem(LAST_SYNC_KEY) || null;
}
function setLastSyncTime() {
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
}

// ── API helpers ──
async function apiFetch(path, options = {}) {
  const url = API_BASE + path;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error:', err.message);
    return null;
  }
}

// ── Initialize app data ──
let appData = loadDataLocal();
let appSettings = loadSettingsLocal();

// ── 智能合并：以 updatedAt 为准，谁新用谁的 ──
function smartMerge(localItems, serverItems) {
  const merged = {};
  // 本地数据优先建立 map
  for (const item of localItems) {
    merged[item.id] = item;
  }
  // 服务器数据对比：如果服务器的更新，就用服务器的
  for (const serverItem of serverItems) {
    const localItem = merged[serverItem.id];
    if (!localItem) {
      // 服务器有、本地没有 → 新增
      merged[serverItem.id] = serverItem;
    } else {
      // 两边都有 → 比时间戳
      const localTime = localItem.updatedAt || localItem.createdAt || '';
      const serverTime = serverItem.updatedAt || serverItem.createdAt || '';
      if (serverTime > localTime) {
        merged[serverItem.id] = serverItem;
      }
      // 否则保留本地（本地更新）
    }
  }
  return Object.values(merged);
}

function mergeAllData(serverData) {
  appData.plans = smartMerge(appData.plans, serverData.plans || []);
  appData.autotasks = smartMerge(appData.autotasks, serverData.autotasks || []);
  appData.learning = smartMerge(appData.learning, serverData.learning || []);
  appData.habits = smartMerge(appData.habits, serverData.habits || []);
  appData.finance = smartMerge(appData.finance, serverData.finance || []);
}

async function initData() {
  // 1. 尝试连接服务器
  const serverData = await apiFetch('/sync');
  if (serverData && serverData.plans) {
    // 2. 服务器可达 → 先推送本地离线期间有变化的条目，再智能合并
    const pending = getPendingChanges();
    const hasPending = Object.keys(pending).some(k => Object.keys(pending[k] || {}).length > 0);
    if (hasPending) {
      // 把完整本地数据推上去（服务器用 INSERT OR REPLACE，不会丢数据）
      await apiFetch('/sync', { method: 'POST', body: JSON.stringify(appData) });
      clearPendingChanges();
    }
    // 3. 拉取服务器最新数据做智能合并
    const freshServerData = await apiFetch('/sync');
    if (freshServerData && freshServerData.plans) {
      mergeAllData(freshServerData);
    } else {
      mergeAllData(serverData);
    }
    saveDataLocal(appData);
    setLastSyncTime();
    return 'synced';
  }
  // 4. 服务器不可达 → 纯离线模式，记录后续修改
  return 'offline';
}

// ── 保存：写本地 + 尝试推服务器 + 记录离线变更 ──
function saveAll() {
  saveDataLocal(appData);
  apiFetch('/sync', {
    method: 'POST',
    body: JSON.stringify(appData),
  }).then(result => {
    if (result) {
      setLastSyncTime();
    }
  });
}

// ── 标记某条记录有修改（离线时调用） ──
function markItemUpdated(item, moduleName) {
  item.updatedAt = new Date().toISOString();
  // 如果当前是离线状态（上次同步失败），记录 pending change
  const lastSync = getLastSyncTime();
  if (!lastSync || (Date.now() - new Date(lastSync).getTime() > 60000)) {
    addPendingChange(moduleName, item.id);
  }
}

function normalizeData(data) {
  data.autotasks?.forEach(t => {
    if (typeof t.completedDates === 'string') t.completedDates = JSON.parse(t.completedDates || '[]');
  });
  data.learning?.forEach(l => {
    if (typeof l.images === 'string') l.images = JSON.parse(l.images || '[]');
  });
  return data;
}

// ── 手动全量推送（设置中心的"上传到云端"按钮） ──
async function fullPushToServer() {
  const result = await apiFetch('/sync', { method: 'POST', body: JSON.stringify(appData) });
  if (result) {
    setLastSyncTime();
    clearPendingChanges();
  }
  return result;
}

// ── 手动全量拉取（设置中心的"从云端拉取"按钮） ──
async function fullPullFromServer() {
  const serverData = await apiFetch('/sync');
  if (serverData && serverData.plans) {
    mergeAllData(serverData);
    saveDataLocal(appData);
    setLastSyncTime();
    return true;
  }
  return false;
}

export {
  appData, appSettings, defaultData, defaultSettings,
  loadDataLocal, saveDataLocal, loadSettingsLocal, saveSettingsLocal,
  apiFetch, initData, saveAll, normalizeData,
  markItemUpdated, fullPushToServer, fullPullFromServer,
  getLastSyncTime, setLastSyncTime,
  STORAGE_KEY, SETTINGS_KEY, API_BASE
};
