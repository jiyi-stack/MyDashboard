// ========================================
// UI FRAMEWORK — toast, modal, particles, navigation
// ========================================
import { getEncourage } from './utils.js';
import { iconHTML } from './icons.js';

// ── Toast ──
export function showToast(msg, type='info', icon='') {
  const iconMap = { 
    success: 'check-circle', 
    warning: 'alert-triangle', 
    info: 'info' 
  };
  const iconName = icon || iconMap[type] || 'info';
  const colorMap = {
    success: 'var(--success)',
    warning: 'var(--warning)',
    info: 'var(--primary)',
    error: 'var(--danger)'
  };
  const iconColor = colorMap[type] || 'var(--text-secondary)';
  const el = document.createElement('div'); el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${iconHTML(iconName, { size: 18, color: iconColor })}</span>${msg}`;
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

// ── Reminder Sound ──
export function playReminderSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const times = [0, 0.2, 0.4];
    times.forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = i === 1 ? 880 : 660;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + t + 0.15);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.15);
    });
  } catch (e) { console.warn('Audio not supported'); }
}

// ── Task Reminder Modal ──
export function showTaskReminder(task) {
  playReminderSound();
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification('⏰ 定时任务提醒', {
        body: `「${task.name}」该处理啦！`,
        icon: '',
      });
    } catch (e) {}
  }
  const overlay = document.createElement('div');
  overlay.className = 'reminder-overlay';
  overlay.innerHTML = `
    <div class="reminder-modal">
      <div class="reminder-icon">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
    <div class="reminder-title">任务提醒</div>
    <div class="reminder-task-name">${task.name}</div>
    ${task.description ? `<div class="reminder-task-desc">${task.description}</div>` : ''}
    <div class="reminder-time">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      ${task.scheduleTime || ''}
    </div>
    <div class="reminder-actions">
      <button class="reminder-btn reminder-btn-secondary">稍后提醒</button>
      <button class="reminder-btn reminder-btn-primary">知道了</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  const close = () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
  };
  overlay.querySelector('.reminder-btn-primary').onclick = close;
  overlay.querySelector('.reminder-btn-secondary').onclick = close;
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  return { overlay, close };
}

// ── Export / Import ──
export function exportData(appData) {
  const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `星河浅滩_数据备份_${new Date().toISOString().slice(0,10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  const el = document.createElement('div'); el.className = 'export-toast';
  el.innerHTML = `${iconHTML('check-circle', { size: 16, color: '#10B981' })} 数据已导出备份！`;
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

// ── Custom Select Component ──
let _activeSelect = null;

document.addEventListener('click', (e) => {
  if (_activeSelect && !e.target.closest('.custom-select')) {
    closeCustomSelect();
  }
});

export function closeCustomSelect() {
  if (_activeSelect) {
    _activeSelect.classList.remove('open');
    _activeSelect = null;
  }
}

export function createCustomSelect(options) {
  const {
    id = '',
    value = '',
    items = [],
    onChange = null,
    size = 'md',
    variant = 'default',
    placeholder = '',
    className = '',
    align = 'left'
  } = options;

  const selectedItem = items.find(i => i.value === value) || items[0] || { label: placeholder || '请选择', value: '' };
  
  const selectEl = document.createElement('div');
  selectEl.className = `custom-select ${variant} size-${size} ${className}`.trim();
  if (id) selectEl.id = id;
  selectEl.dataset.value = selectedItem.value || '';

  selectEl.innerHTML = `
    <div class="custom-select-trigger">
      <span class="custom-select-label">${selectedItem.label || placeholder || '请选择'}</span>
      <span class="custom-select-arrow">${iconHTML('chevron-down', { size: 14 })}</span>
    </div>
    <div class="custom-select-menu align-${align}">
      ${items.map(item => `
        <div class="custom-select-option ${item.value === selectedItem.value ? 'selected' : ''}" data-value="${item.value}">
          ${item.icon ? `<span class="custom-select-option-icon">${iconHTML(item.icon, { size: 14, color: item.color || '' })}</span>` : ''}
          <span class="custom-select-option-label">${item.label}</span>
          ${item.value === selectedItem.value ? `<span class="custom-select-check">${iconHTML('check', { size: 14 })}</span>` : ''}
        </div>
      `).join('')}
    </div>
  `;

  const trigger = selectEl.querySelector('.custom-select-trigger');
  const menu = selectEl.querySelector('.custom-select-menu');
  const optionEls = selectEl.querySelectorAll('.custom-select-option');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = selectEl.classList.contains('open');
    closeCustomSelect();
    if (!isOpen) {
      selectEl.classList.add('open');
      _activeSelect = selectEl;
    }
  });

  optionEls.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.dataset.value;
      const item = items.find(i => i.value === val);
      if (!item) return;

      selectEl.dataset.value = val;
      const labelEl = selectEl.querySelector('.custom-select-label');
      if (labelEl) labelEl.textContent = item.label;

      optionEls.forEach(o => {
        o.classList.toggle('selected', o.dataset.value === val);
        const check = o.querySelector('.custom-select-check');
        if (o.dataset.value === val && !check) {
          o.insertAdjacentHTML('beforeend', `<span class="custom-select-check">${iconHTML('check', { size: 14 })}</span>`);
        } else if (o.dataset.value !== val && check) {
          check.remove();
        }
      });

      closeCustomSelect();
      if (onChange) onChange(val, item);
    });
  });

  return {
    el: selectEl,
    getValue: () => selectEl.dataset.value,
    setValue: (val) => {
      const item = items.find(i => i.value === val);
      if (!item) return;
      selectEl.dataset.value = val;
      const labelEl = selectEl.querySelector('.custom-select-label');
      if (labelEl) labelEl.textContent = item.label;
      optionEls.forEach(o => {
        o.classList.toggle('selected', o.dataset.value === val);
        const check = o.querySelector('.custom-select-check');
        if (o.dataset.value === val && !check) {
          o.insertAdjacentHTML('beforeend', `<span class="custom-select-check">${iconHTML('check', { size: 14 })}</span>`);
        } else if (o.dataset.value !== val && check) {
          check.remove();
        }
      });
    },
    updateItems: (newItems) => {
      items.length = 0;
      items.push(...newItems);
      const currentVal = selectEl.dataset.value;
      const selectedItem = newItems.find(i => i.value === currentVal) || newItems[0];
      if (selectedItem) {
        selectEl.dataset.value = selectedItem.value;
        const labelEl = selectEl.querySelector('.custom-select-label');
        if (labelEl) labelEl.textContent = selectedItem.label;
      }
      const menuEl = selectEl.querySelector('.custom-select-menu');
      if (menuEl) {
        menuEl.innerHTML = newItems.map(item => `
          <div class="custom-select-option ${item.value === selectEl.dataset.value ? 'selected' : ''}" data-value="${item.value}">
            ${item.icon ? `<span class="custom-select-option-icon">${iconHTML(item.icon, { size: 14, color: item.color || '' })}</span>` : ''}
            <span class="custom-select-option-label">${item.label}</span>
            ${item.value === selectEl.dataset.value ? `<span class="custom-select-check">${iconHTML('check', { size: 14 })}</span>` : ''}
          </div>
        `).join('');
        menuEl.querySelectorAll('.custom-select-option').forEach(opt => {
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = opt.dataset.value;
            const item = newItems.find(i => i.value === val);
            if (!item) return;
            selectEl.dataset.value = val;
            const labelEl = selectEl.querySelector('.custom-select-label');
            if (labelEl) labelEl.textContent = item.label;
            menuEl.querySelectorAll('.custom-select-option').forEach(o => {
              o.classList.toggle('selected', o.dataset.value === val);
              const check = o.querySelector('.custom-select-check');
              if (o.dataset.value === val && !check) {
                o.insertAdjacentHTML('beforeend', `<span class="custom-select-check">${iconHTML('check', { size: 14 })}</span>`);
              } else if (o.dataset.value !== val && check) {
                check.remove();
              }
            });
            closeCustomSelect();
            if (onChange) onChange(val, item);
          });
        });
      }
    }
  };
}
