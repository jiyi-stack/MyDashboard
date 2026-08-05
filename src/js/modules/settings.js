// ========================================
// 设置中心模块
// ========================================
import { showConfirm, showToast } from '../ui-framework.js';

export function renderSettings(container, appData, appSettings, saveAll, saveSettingsFn, renderFn) {
  container.innerHTML = `
    <div class="page-title">设置中心</div>
    <div class="page-subtitle">个性化配置你的工作台</div>

    <div class="card" style="margin-bottom:16px">
      <div class="section-title">🔔 提醒设置</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
        <div><div style="font-size:14px;font-weight:500">消息提醒</div><div style="font-size:12px;color:var(--text-secondary)">定时任务到期自动弹窗提醒</div></div>
        <div class="toggle ${appSettings.notifications?'on':''}" id="toggleNotif"></div></div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
        <div><div style="font-size:14px;font-weight:500">提醒音量</div><div style="font-size:12px;color:var(--text-secondary)">当前：${appSettings.reminderVolume}%</div></div>
        <input type="range" min="0" max="100" value="${appSettings.reminderVolume}" style="width:120px" id="volumeSlider"></div></div>

    <div class="card" style="margin-bottom:16px">
      <div class="section-title">🎨 界面主题</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
        <div><div style="font-size:14px;font-weight:500">当前主题</div><div style="font-size:12px;color:var(--text-secondary)">柔光治愈</div></div><span class="tag tag-done">已启用</span></div></div>

    <div class="card" style="margin-bottom:16px">
      <div class="section-title">☁️ 数据同步</div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">
        <div><div style="font-size:14px;font-weight:500">自动同步</div><div style="font-size:12px;color:var(--text-secondary)">数据实时保存到云端</div></div>
        <div class="toggle ${appSettings.autoSync?'on':''}" id="toggleSync"></div></div>
      <div style="padding:12px 0;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="btnExport">📥 导出数据备份</button>
        <button class="btn btn-outline" id="btnImport">📤 导入数据恢复</button>
        <input type="file" id="importFileInput" accept=".json" style="display:none"></div>
      <div style="padding:12px 0;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary" id="btnSyncPush">☁️ 上传数据到云端</button>
        <button class="btn btn-outline" id="btnSyncPull">☁️ 从云端拉取数据</button></div>
      <button class="btn btn-danger btn-sm" style="margin-top:8px" id="btnReset">🔄 重置所有数据</button></div>

    <div class="card" style="margin-bottom:16px">
      <div class="section-title">📊 数据统计</div>
      <div style="font-size:13px;color:var(--text-secondary);line-height:2">
        <div>计划总数：${appData.plans.length} 条</div><div>定时任务：${appData.autotasks.length} 项</div>
        <div>学习记录：${appData.learning.length} 条</div><div>习惯追踪：${appData.habits.length} 项</div>
        <div>记账记录：${appData.finance.length} 条</div>
        <div style="margin-top:8px;font-size:11px;color:var(--text-light)">数据通过云端数据库持久化存储，双端同步</div></div></div>

    <div style="text-align:center;padding:24px;color:var(--text-light);font-size:12px">个人全能工作台 v1.0 · 用心管理每一天 ✨</div>`;

  document.getElementById('toggleNotif').onclick = () => { appSettings.notifications = !appSettings.notifications; saveSettingsFn(); renderFn(); showToast(`消息提醒：${appSettings.notifications?'已开启':'已关闭'}`, 'info'); };
  document.getElementById('toggleSync').onclick = () => { appSettings.autoSync = !appSettings.autoSync; saveSettingsFn(); renderFn(); showToast(`自动同步：${appSettings.autoSync?'已开启':'已关闭'}`, 'info'); };
  document.getElementById('volumeSlider').onchange = function() { appSettings.reminderVolume = parseInt(this.value); saveSettingsFn(); };
  document.getElementById('btnExport').onclick = () => window._exportData();
  document.getElementById('btnImport').onclick = () => document.getElementById('importFileInput').click();
  document.getElementById('importFileInput').onchange = function() { window._importDataFile(this.files[0]); };
  document.getElementById('btnSyncPush').onclick = () => window._syncPush();
  document.getElementById('btnSyncPull').onclick = () => window._syncPull();
  document.getElementById('btnReset').onclick = () => {
    showConfirm('重置数据', '确定要重置所有数据吗？此操作会清除所有计划和记录，不可撤销！', () => { window._resetAllData(); });
  };
}

// Sync helpers available on window
export { };
