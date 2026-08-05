// ========================================
// UI FRAMEWORK — toast, modal, particles, navigation
// ========================================
import { getEncourage } from './utils.js';

// ── Toast ──
export function showToast(msg, type='info', emoji='') {
  const map = { success:'✅', warning:'⚠️', info:'ℹ️' };
  const e = emoji || map[type] || '';
  const el = document.createElement('div'); el.className = `toast ${type}`;
  el.innerHTML = `<span class="emoji">${e}</span>${msg}`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 2800);
}

// ── Particles ──
export function burstParticles(x, y, count=14) {
  const container = document.getElementById('particlesContainer');
  const emojis = ['✨','⭐','🌟','💫','🌸','🌺','🎉','💖','🔥','💪'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span'); p.className = 'particle';
    p.textContent = emojis[i % emojis.length];
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.style.setProperty('--rot', (Math.random()*60-30)+'deg');
    p.style.animationDuration = (0.8 + Math.random()*0.8) + 's';
    p.style.animationDelay = Math.random()*0.15 + 's';
    container.appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
}

export function showEncourage(type) {
  const msg = getEncourage(type);
  showToast(msg, 'success');
  burstParticles(window.innerWidth/2, window.innerHeight * 0.4, 16);
}

// ── Modal ──
export function showModal(title, content, onSave) {
  const overlay = document.createElement('div'); overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header"><div class="modal-title">${title}</div><button class="modal-close">&times;</button></div>
      <div class="modal-body">${content}</div>
    </div>`;
  document.body.appendChild(overlay);
  const close = () => {
    overlay.style.opacity = '0'; overlay.style.transition = 'opacity 0.2s';
    setTimeout(() => overlay.remove(), 200);
  };
  overlay.querySelector('.modal-close').onclick = close;
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  return {
    overlay, close,
    getEl: (sel) => overlay.querySelector(sel),
    getAll: (sel) => overlay.querySelectorAll(sel),
  };
}

// ── Confirm Dialog ──
export function showConfirm(title, msg, onConfirm) {
  const modal = showModal(title, `
    <p style="color:var(--text-secondary);font-size:14px">${msg}</p>
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-danger confirm-btn">确认</button>
    </div>`);
  modal.getEl('.cancel-btn').onclick = modal.close;
  modal.getEl('.confirm-btn').onclick = () => { onConfirm(); modal.close(); };
}

// ── Export / Import ──
export function exportData(appData) {
  const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `全能工作台_数据备份_${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  const el = document.createElement('div'); el.className = 'export-toast';
  el.textContent = '✅ 数据已导出备份！';
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transition='opacity 0.5s'; setTimeout(() => el.remove(), 500); }, 2000);
}

export function importDataFile(file, appData, saveAll, renderFn) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const d = JSON.parse(e.target.result);
      if (d.plans && d.autotasks && d.learning && d.habits && d.finance) {
        Object.assign(appData, d);
        saveAll(); renderFn();
        showToast('数据导入成功！', 'success');
      } else { showToast('文件格式不正确', 'warning'); }
    } catch (ex) { showToast('文件解析失败', 'warning'); }
  };
  reader.readAsText(file);
}

// ── Navigation ──
export const PAGE_TITLES = {
  dashboard: ['数据看板', ''],
  plans: ['计划清单', '管理你的待办计划'],
  autotasks: ['定时任务', '自动化日常事务管控'],
  learning: ['学习记录', '记录每一次成长'],
  habits: ['习惯追踪', '培养好习惯，改善坏习惯'],
  finance: ['记账账本', '理性消费，心中有数'],
  settings: ['设置中心', '个性化配置'],
};

export function navigateTo(view, { renderFn, currentViewRef }) {
  currentViewRef.current = view;
  document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  const [title, sub] = PAGE_TITLES[view] || ['', ''];
  document.getElementById('headerTitle').textContent = title;
  document.getElementById('headerSub').textContent = sub;
  const actBtn = document.getElementById('headerAction');
  if (['plans','autotasks','learning','habits','finance'].includes(view)) {
    actBtn.style.display = 'inline-flex';
    actBtn.textContent = '＋ 新增';
    actBtn.onclick = () => window._openAddModal && window._openAddModal(view);
  } else { actBtn.style.display = 'none'; }
  renderFn();
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}
