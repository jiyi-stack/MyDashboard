// ========================================
// DATA LAYER — API client + local fallback + smart merge
// ========================================

const STORAGE_KEY = 'mydashboard_data';
const SETTINGS_KEY = 'mydashboard_settings';
// 记录最后一次同步时间戳的 key
const LAST_SYNC_KEY = 'mydashboard_last_sync';
// 记录离线期间修改过的条目 ID（以便回家后只推送变化的部分）
const PENDING_CHANGES_KEY = 'mydashboard_pending_changes';
// 电脑端服务器地址配置 key（APK 里可自定义填写，如 192.168.1.100:3001）
const SERVER_URL_KEY = 'mydashboard_server_url';

// 服务器 API 基地址：
// 1) 若在设置中心配置过服务器地址（APK/局域网），优先使用
// 2) 浏览器开发模式走 vite 代理 /api
// 3) 其余（浏览器生产部署）走同源 /api
function getServerBase() {
  try {
    const cfg = localStorage.getItem(SERVER_URL_KEY);
    if (cfg) {
      const { url } = JSON.parse(cfg);
      if (url) {
        const base = String(url).trim().replace(/\/+$/, '');
        if (base) return base.endsWith('/api') ? base : base + '/api';
      }
    }
  } catch (e) { /* 配置损坏时回退默认 */ }
  return (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ? '/api' : (window.location.origin + '/api');
}

function setServerUrl(url) {
  const val = String(url || '').trim();
  if (val) localStorage.setItem(SERVER_URL_KEY, JSON.stringify({ url: val }));
  else localStorage.removeItem(SERVER_URL_KEY);
}

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
  finance: []
};

const defaultSettings = { notifications:true, theme:'light', autoSync:true, reminderVolume:70 };

// ── localStorage helpers ──
function loadDataLocal() {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) {
      try {
        const parsed = JSON.parse(d);
        // 数据完整性校验：必须有5个模块的数组
        const requiredKeys = ['plans', 'autotasks', 'learning', 'habits', 'finance'];
        const valid = requiredKeys.every(k => Array.isArray(parsed[k]));
        if (valid) {
          return parsed;
        }
        console.warn('本地数据结构异常，回退到默认数据');
      } catch (e2) { console.warn('本地数据JSON解析失败，回退到默认数据'); }
    }
    return JSON.parse(JSON.stringify(defaultData));
  } catch (e) { return JSON.parse(JSON.stringify(defaultData)); }
}
function saveDataLocal(data) {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (e) {
    console.error('保存数据失败:', e.message);
    // 如果是配额错误，尝试清理旧删除记录
    if (e.name === 'QuotaExceededError') {
      console.warn('localStorage 配额不足，尝试清理已删除记录...');
      // 清理30天前的软删除记录
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      const cutoffStr = cutoff.toISOString();
      for (const key of ['plans', 'autotasks', 'learning', 'habits', 'finance']) {
        data[key] = data[key].filter(item => {
          if (!item.deleted) return true;
          return (item.updatedAt || item.createdAt || '') > cutoffStr;
        });
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.warn('清理后保存成功');
        return true;
      } catch (e2) {
        console.error('清理后仍保存失败:', e2.message);
        return false;
      }
    }
    return false;
  }
}
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
  const url = getServerBase() + path;
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

// ── 智能合并：以 updatedAt 为准，谁新用谁的；支持软删除 ──
function smartMerge(localItems, serverItems) {
  const serverMap = {};
  for (const item of serverItems) {
    serverMap[item.id] = item;
  }
  const merged = [];

  for (const lItem of localItems) {
    const sItem = serverMap[lItem.id];
    if (sItem) {
      const localTime = lItem.updatedAt || lItem.createdAt || '';
      const serverTime = sItem.updatedAt || sItem.createdAt || '';
      merged.push(serverTime > localTime ? sItem : lItem);
    } else {
      merged.push(lItem);
    }
  }

  for (const sItem of serverItems) {
    if (!merged.find(m => m.id === sItem.id)) {
      merged.push(sItem);
    }
  }
  return merged;
}

function filterDeleted(items) {
  return items.filter(item => !item.deleted);
}

function mergeAllData(serverData) {
  appData.plans = smartMerge(appData.plans, serverData.plans || []);
  appData.autotasks = smartMerge(appData.autotasks, serverData.autotasks || []);
  appData.learning = smartMerge(appData.learning, serverData.learning || []);
  appData.habits = smartMerge(appData.habits, serverData.habits || []);
  appData.finance = smartMerge(appData.finance, serverData.finance || []);
}

async function initData() {
  // 定期清理30天前的软删除记录
  cleanupOldDeleted();

  const serverData = await apiFetch('/sync');
  // 检查服务器是否有实际数据（不仅是空数组）
  const hasServerData = serverData && Object.values(serverData).some(
    arr => Array.isArray(arr) && arr.length > 0
  );
  if (hasServerData) {
    mergeAllData(serverData);
    const pushResult = await apiFetch('/sync', { method: 'POST', body: JSON.stringify(appData) });
    if (pushResult && Object.values(pushResult).some(arr => Array.isArray(arr) && arr.length > 0)) {
      mergeAllData(pushResult);
    }
    saveDataLocal(appData);
    setLastSyncTime();
    clearPendingChanges();
    return 'synced';
  }
  // 服务器无数据，仅保存本地
  saveDataLocal(appData);
  return 'offline';
}

// 清理30天前的软删除记录
function cleanupOldDeleted() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString();
  let cleaned = 0;
  for (const key of ['plans', 'autotasks', 'learning', 'habits', 'finance']) {
    const before = appData[key].length;
    appData[key] = appData[key].filter(item => {
      if (!item.deleted) return true;
      const time = (item.updatedAt || item.createdAt || '');
      if (time > cutoffStr) return true; // 保留30天内的删除
      cleaned++;
      return false; // 永久删除
    });
  }
  if (cleaned > 0) console.log(`[cleanup] 清理了 ${cleaned} 条过期删除记录`);
}

// ── 保存：写本地 + 尝试推服务器 + 记录离线变更 ──
function saveAll() {
  const saved = saveDataLocal(appData);
  if (!saved) {
    // 保存失败时通过全局事件通知 UI
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('save-failed', { detail: { reason: 'localStorage 写入失败，可能是存储空间不足' } }));
    }
  }
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
  STORAGE_KEY, SETTINGS_KEY, SERVER_URL_KEY, getServerBase, setServerUrl
};
