import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, getStatusTag, initSwipeActions } from '../utils.js';
import { showModal, showConfirm, showToast, showEncourage, createCustomSelect } from '../ui-framework.js';
import { iconHTML } from '../icons.js';

const iconColors = ['purple', 'blue', 'green', 'orange', 'pink', 'red'];
const planIcons = ['file-text', 'briefcase', 'book-open', 'target', 'code', 'lightbulb'];

function getPlanColor(idx) {
  return iconColors[idx % iconColors.length];
}

function getPlanIcon(idx) {
  return planIcons[idx % planIcons.length];
}

function getProgress(status) {
  if (status === '已完成') return 100;
  if (status === '进行中') return 60;
  return 30;
}

function getStatusClass(status) {
  if (status === '已完成') return 'done';
  if (status === '进行中') return 'doing';
  return 'todo';
}

function getPriorityTag(priority) {
  if (!priority || priority === '中') return `<span class="plan-priority p2">P2</span>`;
  if (priority === '高') return `<span class="plan-priority p1">P1</span>`;
  if (priority === '低') return `<span class="plan-priority p3">P3</span>`;
  return `<span class="plan-priority p4">P4</span>`;
}

function getStatusTagSmall(status) {
  const map = {
    '未完成': { cls: 'todo', text: '未完成' },
    '进行中': { cls: 'doing', text: '进行中' },
    '已完成': { cls: 'done', text: '已完成' },
    '拖延中': { cls: 'delay', text: '拖延中' },
    '已作废': { cls: 'cancel', text: '已作废' }
  };
  const s = map[status] || map['未完成'];
  return `<span class="plan-status-small ${s.cls}">${s.text}</span>`;
}

function getRingProgress(progress, isDone) {
  const size = 18;
  const strokeWidth = 3;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  const color = isDone ? '#10B981' : '#3B82F6';
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="plan-progress-ring">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#E2E8F0" stroke-width="${strokeWidth}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeWidth}"
        stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"
        transform="rotate(-90 ${size/2} ${size/2})"/>
    </svg>`;
}

export function renderPlans(container, appData, saveAll, currentMonth) {
  const filterStatus = container.dataset.filterStatus || '全部';
  let plans = appData.plans.filter(p => !p.deleted);
  if (filterStatus !== '全部') plans = plans.filter(p => p.status === filterStatus);
  if (currentMonth) plans = plans.filter(p => monthMatch(p.createdAt?.slice(0,7), '') || monthMatch(p.deadline, currentMonth) || monthMatch(p.createdAt?.slice(0,7), currentMonth));
  plans.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  container.innerHTML = `
    <div class="plan-header">
      <div class="plan-header-left">
        <div class="plan-title">计划清单</div>
        <div class="plan-subtitle">管理你的待办计划 · 共 ${plans.length} 条</div>
      </div>
      <div class="plan-header-illustration">
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="80" y="10" width="100" height="110" rx="10" fill="#EEF2FF" opacity="0.8"/>
          <rect x="80" y="10" width="100" height="20" rx="10" fill="#C7D2FE"/>
          <rect x="95" y="40" width="60" height="6" rx="3" fill="#A5B4FC"/>
          <rect x="95" y="55" width="75" height="6" rx="3" fill="#C7D2FE"/>
          <rect x="95" y="70" width="50" height="6" rx="3" fill="#C7D2FE"/>
          <rect x="95" y="85" width="65" height="6" rx="3" fill="#E0E7FF"/>
          <rect x="95" y="100" width="45" height="6" rx="3" fill="#E0E7FF"/>
          <circle cx="165" cy="75" r="18" fill="#818CF8"/>
          <path d="M157 75 L163 81 L173 71" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="60" y="20" width="35" height="50" rx="6" fill="#F3E8FF" opacity="0.7"/>
          <rect x="68" y="28" width="22" height="3" rx="1.5" fill="#C084FC"/>
          <rect x="68" y="36" width="18" height="3" rx="1.5" fill="#DDD6FE"/>
          <rect x="68" y="44" width="20" height="3" rx="1.5" fill="#DDD6FE"/>
          <rect x="68" y="52" width="16" height="3" rx="1.5" fill="#EDE9FE"/>
          <circle cx="78" cy="60" r="3" fill="#A855F7"/>
        </svg>
      </div>
    </div>
    <div class="plan-filters">
      <button class="btn btn-outline btn-sm" onclick="window._openPlanModal()">
        ${iconHTML('plus', { size: 16 })} 新增
      </button>
      <div style="flex:1"></div>
      <div id="planStatusFilter"></div>
      <div id="planMonthFilter"></div>
    </div>
    <div id="planList"></div>`;

  container.dataset.filterStatus = filterStatus;
  
  const statusItems = [
    { value: '全部', label: '全部状态' },
    { value: '未完成', label: '未完成' },
    { value: '进行中', label: '进行中' },
    { value: '已完成', label: '已完成' },
    { value: '拖延中', label: '拖延中' },
    { value: '已作废', label: '已作废' },
  ];
  const statusSelect = createCustomSelect({
    id: 'planStatusSelect',
    value: filterStatus,
    items: statusItems,
    size: 'sm',
    variant: 'text',
    align: 'right',
    onChange: (val) => { window._filterPlans(val); }
  });
  document.getElementById('planStatusFilter').appendChild(statusSelect.el);

  const monthItems = [{ value: '', label: '全部时间' }, ...getMonths().map(m => ({ value: m, label: monthLabel(m) }))];
  const monthSelect = createCustomSelect({
    id: 'planMonthSelect',
    value: currentMonth || '',
    items: monthItems,
    size: 'sm',
    variant: 'text',
    align: 'right',
    onChange: (val) => { window._filterPlansMonth(val); }
  });
  document.getElementById('planMonthFilter').appendChild(monthSelect.el);

  renderPlanList(plans, appData, saveAll);
}

function renderPlanList(plans, appData, saveAll) {
  const list = document.getElementById('planList');
  if (!list) return;
  if (!plans.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${iconHTML('clipboard-list', { size: 64 })}</div>
        <div class="empty-state-text">暂无计划</div>
        <div class="empty-state-hint">点击右上角「新增」创建你的第一条计划吧</div>
      </div>`;
    return;
  }
  list.innerHTML = plans.map((p, idx) => {
    const progress = getProgress(p.status);
    const statusClass = getStatusClass(p.status);
    const color = getPlanColor(idx);
    const icon = getPlanIcon(idx);
    const isDone = p.status === '已完成';
    
    return `
    <div class="swipe-wrap plan-swipe" data-id="${p.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${iconHTML('edit', { color: '#fff', size: 20 })}
        </div>
        <div class="swipe-action-btn delete">
          ${iconHTML('trash', { color: '#fff', size: 20 })}
        </div>
      </div>
      <div class="swipe-card plan-card">
        <div class="plan-icon ${color}">
          ${iconHTML(icon, { color: '#fff', size: 26 })}
        </div>
        <div class="plan-info">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap">
            <span class="plan-name" style="${isDone?'color:var(--text-secondary);text-decoration:line-through;text-decoration-color:var(--text-tertiary)':''}">${escHtml(p.name)}</span>
            ${getPriorityTag(p.priority)}
            ${getStatusTagSmall(p.status)}
          </div>
          ${p.detail?`<div class="plan-desc">${escHtml(p.detail)}</div>`:''}
          <div class="plan-meta">
            ${p.deadline?`<span class="plan-meta-item">${iconHTML('calendar', { size: 14, color: 'currentColor' })} 截止: ${p.deadline}</span>`:''}
            <span class="plan-meta-item">${getRingProgress(progress, isDone)} 进度: ${progress}%</span>
          </div>
        </div>
        <div class="plan-actions">
          <div class="dropdown" data-plan-id="${p.id}">
            <button class="btn btn-ghost btn-icon plan-more-btn" onclick="window._togglePlanMenu('${p.id}')">
              ${iconHTML('more-horizontal', { size: 18 })}
            </button>
            <div class="dropdown-menu" id="planMenu_${p.id}">
              <div class="dropdown-item" onclick="window._updatePlanStatus('${p.id}', '未完成')">
                ${iconHTML('circle', { size: 16, color: '#94A3B8' })} 未完成
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${p.id}', '进行中')">
                ${iconHTML('play-circle', { size: 16, color: '#3B82F6' })} 进行中
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${p.id}', '已完成')">
                ${iconHTML('check-circle', { size: 16, color: '#10B981' })} 已完成
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${p.id}', '拖延中')">
                ${iconHTML('alert-circle', { size: 16, color: '#F59E0B' })} 拖延中
              </div>
              <div class="dropdown-item" onclick="window._updatePlanStatus('${p.id}', '已作废')">
                ${iconHTML('x-circle', { size: 16, color: '#EF4444' })} 已作废
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('') + `<div class="plan-empty-footer">已经全部加载完毕</div>`;

  initSwipeActions(list, {
    onEdit: (id) => window._openPlanModal(id),
    onDelete: (id) => window._deletePlan(id)
  });
}

export function openPlanModal(editId, appData, saveAll, renderFn) {
  const plan = editId ? appData.plans.find(p => p.id === editId) : null;
  const content = `
    <div class="form-group"><label class="form-label">计划名称 *</label><input id="planName" value="${plan?escHtml(plan.name):''}" placeholder="输入计划名称"></div>
    <div class="form-group"><label class="form-label">计划详情</label><textarea id="planDetail" rows="3" placeholder="详细描述...">${plan?escHtml(plan.detail||''):''}</textarea></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">截止时间</label><input type="date" id="planDeadline" value="${plan?(plan.deadline||''):''}"></div>
      <div class="form-group"><label class="form-label">状态</label>
        <select id="planStatus">
          <option value="未完成" ${plan&&plan.status==='未完成'?'selected':''}>未完成</option>
          <option value="进行中" ${plan&&plan.status==='进行中'?'selected':''}>进行中</option>
          <option value="已完成" ${plan&&plan.status==='已完成'?'selected':''}>已完成</option>
          <option value="拖延中" ${plan&&plan.status==='拖延中'?'selected':''}>拖延中</option>
          <option value="已作废" ${plan&&plan.status==='已作废'?'selected':''}>已作废</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">优先级</label>
        <select id="planPriority">
          <option value="高" ${plan&&plan.priority==='高'?'selected':''}>P1 - 高</option>
          <option value="中" ${!plan||plan.priority==='中'?'selected':''}>P2 - 中</option>
          <option value="低" ${plan&&plan.priority==='低'?'selected':''}>P3 - 低</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">备注</label><input id="planNote" value="${plan?escHtml(plan.note||''):''}" placeholder="备注信息"></div>
    </div>
    ${plan?`<div class="form-row">
      <div class="form-group"><label class="form-label">创建时间</label><div class="form-readonly">${fmtDate(plan.createdAt)}</div></div>
      <div class="form-group"></div>
    </div>`:''}`;
  const modal = showModal(plan?'编辑计划':'新增计划', content + `<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>`);
  modal.getEl('.cancel-btn').onclick = modal.close;
  modal.getEl('.save-btn').onclick = () => {
    const name = modal.getEl('#planName').value.trim();
    if (!name) { showToast('请输入计划名称', 'warning'); return; }
    const data = {
      id: plan ? plan.id : uid(), name,
      detail: modal.getEl('#planDetail').value.trim(),
      deadline: modal.getEl('#planDeadline').value,
      status: modal.getEl('#planStatus').value,
      priority: modal.getEl('#planPriority').value,
      note: modal.getEl('#planNote').value.trim(),
      createdAt: plan ? plan.createdAt : getToday(),
      updatedAt: getNow()
    };
    if (plan) { const idx = appData.plans.findIndex(p => p.id === editId); appData.plans[idx] = data; }
    else { appData.plans.unshift(data); }
    saveAll(); modal.close(); renderFn();
    if (data.status === '已完成') showEncourage('done');
    else showToast('计划已保存', 'success');
  };
}

export function updatePlanStatus(id, status, appData, saveAll, renderFn) {
  const plan = appData.plans.find(p => p.id === id);
  if (!plan) return;
  plan.status = status; plan.updatedAt = getNow();
  if (status === '已完成') plan.deadline = plan.deadline || getToday();
  saveAll(); renderFn();
  if (status === '已完成') showEncourage('done');
  else showToast(`状态已更新为：${status}`, 'info');
}

export function deletePlan(id, appData, saveAll, renderFn) {
  showConfirm('删除计划', '确定要删除这条计划吗？此操作不可撤销。', () => {
    const idx = appData.plans.findIndex(p => p.id === id);
    if (idx >= 0) {
      appData.plans[idx].deleted = true;
      appData.plans[idx].updatedAt = new Date().toISOString();
    }
    saveAll(); renderFn(); showToast('计划已删除', 'info');
  });
}

let _activePlanMenu = null;

export function togglePlanMenu(id) {
  const menu = document.getElementById(`planMenu_${id}`);
  if (!menu) return;
  const card = menu.closest('.plan-card');
  const swipe = card ? card.closest('.swipe-card') : null;
  if (_activePlanMenu && _activePlanMenu !== menu) {
    _activePlanMenu.classList.remove('show');
    const prevCard = _activePlanMenu.closest('.plan-card');
    if (prevCard) {
      prevCard.classList.remove('menu-open');
      const prevSwipe = prevCard.closest('.swipe-card');
      if (prevSwipe) prevSwipe.classList.remove('menu-open');
    }
  }
  menu.classList.toggle('show');
  const isOpen = menu.classList.contains('show');
  if (card) card.classList.toggle('menu-open', isOpen);
  if (swipe) swipe.classList.toggle('menu-open', isOpen);
  _activePlanMenu = isOpen ? menu : null;
}

export function closeAllPlanMenus() {
  if (_activePlanMenu) {
    _activePlanMenu.classList.remove('show');
    const prevCard = _activePlanMenu.closest('.plan-card');
    if (prevCard) {
      prevCard.classList.remove('menu-open');
      const prevSwipe = prevCard.closest('.swipe-card');
      if (prevSwipe) prevSwipe.classList.remove('menu-open');
    }
    _activePlanMenu = null;
  }
}
