// ========================================
// 设置中心模块
// ========================================
import { showConfirm, showToast } from '../ui-framework.js';
import { iconHTML } from '../icons.js';
import { SERVER_URL_KEY } from '../data.js';

function getSavedServerUrl() {
  try {
    const cfg = localStorage.getItem(SERVER_URL_KEY);
    return cfg ? (JSON.parse(cfg).url || '') : '';
  } catch { return ''; }
}

export function renderSettings(container, appData, appSettings, saveAll, saveSettingsFn, renderFn) {
  container.innerHTML = `
    <div class="settings-header">
      <div class="settings-title">设置中心</div>
      <div class="settings-subtitle">个性化配置你的工作台</div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">通用设置</div>
      <div class="settings-card">
        <div class="settings-item">
          <div class="settings-item-icon purple">
            ${iconHTML('bell', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">消息提醒</div>
            <div class="settings-item-desc">定时任务到期自动弹窗提醒</div>
          </div>
          <div class="toggle ${appSettings.notifications?'on':''}" id="toggleNotif"></div>
        </div>
        <div class="settings-item">
          <div class="settings-item-icon blue">
            ${iconHTML('volume-2', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">提醒音量</div>
            <div class="settings-item-desc">当前：${appSettings.reminderVolume}%</div>
          </div>
          <input type="range" min="0" max="100" value="${appSettings.reminderVolume}" class="settings-slider" id="volumeSlider">
        </div>
        <div class="settings-item">
          <div class="settings-item-icon pink">
            ${iconHTML('palette', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">当前主题</div>
            <div class="settings-item-desc">柔光治愈</div>
          </div>
          <span class="tag tag-done">已启用</span>
        </div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">同步设置</div>
      <div class="settings-card">
        <div class="settings-item">
          <div class="settings-item-icon blue">
            ${iconHTML('link', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">电脑服务器地址</div>
            <div class="settings-item-desc">手机与电脑连同一 WiFi，填写电脑 IP 后即可同步</div>
          </div>
        </div>
        <div class="settings-sync-box">
          <input type="text" class="settings-input" id="serverUrlInput" placeholder="例如 192.168.1.100:3001" value="${getSavedServerUrl()}">
          <div class="settings-sync-actions">
            <button class="btn btn-ghost btn-sm" id="btnTestServer">测试连接</button>
            <button class="btn btn-primary btn-sm" id="btnSaveServer">保存地址</button>
          </div>
        </div>
        <div class="settings-sync-hint" id="serverSyncHint">未填写地址时，数据仅保存在本机（App 内不会丢失）</div>
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group-title">数据管理</div>
      <div class="settings-card">
        <div class="settings-item">
          <div class="settings-item-icon green">
            ${iconHTML('cloud', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">自动同步</div>
            <div class="settings-item-desc">数据实时保存到云端</div>
          </div>
          <div class="toggle ${appSettings.autoSync?'on':''}" id="toggleSync"></div>
        </div>
        <div class="settings-item settings-item-clickable" id="btnExport">
          <div class="settings-item-icon blue">
            ${iconHTML('download', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">导出数据备份</div>
          </div>
          <div class="settings-item-arrow">${iconHTML('chevron-right', { size: 16, color: '#C7C7CC' })}</div>
        </div>
        <div class="settings-item settings-item-clickable" id="btnImport">
          <div class="settings-item-icon orange">
            ${iconHTML('upload', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">导入数据恢复</div>
          </div>
          <div class="settings-item-arrow">${iconHTML('chevron-right', { size: 16, color: '#C7C7CC' })}</div>
        </div>
        <input type="file" id="importFileInput" accept=".json" style="display:none">
      </div>
      <div class="settings-card settings-card-separated">
        <div class="settings-item settings-item-clickable" id="btnSyncPush">
          <div class="settings-item-icon purple">
            ${iconHTML('upload', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">上传数据到云端</div>
          </div>
          <div class="settings-item-arrow">${iconHTML('chevron-right', { size: 16, color: '#C7C7CC' })}</div>
        </div>
        <div class="settings-item settings-item-clickable" id="btnSyncPull">
          <div class="settings-item-icon pink">
            ${iconHTML('download', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">从云端拉取数据</div>
          </div>
          <div class="settings-item-arrow">${iconHTML('chevron-right', { size: 16, color: '#C7C7CC' })}</div>
        </div>
      </div>
      <div class="settings-card settings-card-separated">
        <div class="settings-item settings-item-clickable settings-item-danger" id="btnReset">
          <div class="settings-item-icon red">
            ${iconHTML('rotate-ccw', { color: '#fff', size: 18 })}
          </div>
          <div class="settings-item-info">
            <div class="settings-item-name">重置所有数据</div>
          </div>
          <div class="settings-item-arrow">${iconHTML('chevron-right', { size: 16, color: '#C7C7CC' })}</div>
        </div>
      </div>
    </div>

    <div class="settings-footer">星河浅滩 v1.0 · 用心管理每一天</div>`;

  document.getElementById('toggleNotif').onclick = (e) => { e.stopPropagation(); appSettings.notifications = !appSettings.notifications; saveSettingsFn(); renderFn(); showToast(`消息提醒：${appSettings.notifications?'已开启':'已关闭'}`, 'info'); };
  document.getElementById('toggleSync').onclick = (e) => { e.stopPropagation(); appSettings.autoSync = !appSettings.autoSync; saveSettingsFn(); renderFn(); showToast(`自动同步：${appSettings.autoSync?'已开启':'已关闭'}`, 'info'); };
  document.getElementById('volumeSlider').onchange = function(e) { e.stopPropagation(); appSettings.reminderVolume = parseInt(this.value); saveSettingsFn(); };
  document.getElementById('btnExport').onclick = () => window._exportData();
  document.getElementById('btnImport').onclick = () => document.getElementById('importFileInput').click();
  document.getElementById('importFileInput').onchange = function() { window._importDataFile(this.files[0]); };
  document.getElementById('btnSyncPush').onclick = () => window._syncPush();
  document.getElementById('btnSyncPull').onclick = () => window._syncPull();
  document.getElementById('btnReset').onclick = () => {
    showConfirm('重置数据', '确定要重置所有数据吗？此操作会清除所有计划和记录，不可撤销！', () => { window._resetAllData(); });
  };
  document.getElementById('btnSaveServer').onclick = () => {
    const url = document.getElementById('serverUrlInput').value.trim();
    window._saveServerUrl(url);
    renderFn();
    showToast(url ? '服务器地址已保存' : '已清除服务器地址', 'success');
  };
  document.getElementById('btnTestServer').onclick = async () => {
    const url = document.getElementById('serverUrlInput').value.trim();
    if (!url) { showToast('请先填写服务器地址', 'warning'); return; }
    const ok = await window._testServerConnection(url);
    showToast(ok ? '连接成功，电脑端服务正常' : '连接失败，请检查地址和电脑端是否已启动', ok ? 'success' : 'warning');
  };
}

// Sync helpers available on window
export { };
