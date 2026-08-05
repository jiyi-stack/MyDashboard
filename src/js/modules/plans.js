// ========================================
// 计划清单模块
// ========================================
import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, getStatusTag } from '../utils.js';
import { showModal, showConfirm, showToast, showEncourage } from '../ui-framework.js';

export function renderPlans(container, appData, saveAll, currentMonth) {
  const filterStatus = container.dataset.filterStatus || '全部';
  let plans = [...appData.plans];
  if (filterStatus !== '全部') plans = plans.filter(p => p.status === filterStatus);
  if (currentMonth) plans = plans.filter(p => monthMatch(p.createdAt?.slice(0,7), '') || monthMatch(p.deadline, currentMonth) || monthMatch(p.createdAt?.slice(0,7), currentMonth));
  plans.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  container.innerHTML = `
    <div class="page-title">计划清单</div>
    <div class="page-subtitle">管理你的待办计划 · 共 ${appData.plans.length} 条</div>
    <div class="filter-bar">
      <select id="planStatusFilter"><option value="全部">全部状态</option><option value="未完成">未完成</option><option value="已完成">已完成</option><option value="拖延中">拖延中</option><option value="已作废">已作废</option></select>
      <select id="planMonthFilter"><option value="">全部时间</option>${getMonths().map(m => `<option value="${m}" ${m===currentMonth?'selected':''}>${monthLabel(m)}</option>`).join('')}</select>
    </div>
    <div class="list" id="planList"></div>`;

  container.dataset.filterStatus = filterStatus;
  document.getElementById('planStatusFilter').value = filterStatus;
  document.getElementById('planStatusFilter').onchange = function() { window._filterPlans(this.value); };
  document.getElementById('planMonthFilter').onchange = function() { window._filterPlansMonth(this.value); };

  renderPlanList(plans, appData, saveAll);
}

function renderPlanList(plans, appData, saveAll) {
  const list = document.getElementById('planList');
  if (!list) return;
  if (!plans.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">暂无计划</div><div class="empty-state-hint">点击右上角「新增」创建你的第一条计划吧</div></div>`;
    return;
  }
  list.innerHTML = plans.map(p => {
    const isDelaying = p.status === '拖延中';
    const isNew = p.createdAt === getToday();
    return `
    <div class="card ${isNew?'card-new':''} ${isDelaying?'card-delaying':''}" style="display:flex;align-items:flex-start;gap:14px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
          <span style="font-size:15px;font-weight:600">${escHtml(p.name)}</span>${getStatusTag(p.status)}
          ${p.status==='已完成'?'<span style="font-size:12px;color:var(--primary-deep)">🎉</span>':''}</div>
        ${p.detail?`<div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">${escHtml(p.detail)}</div>`:''}
        <div style="font-size:12px;color:var(--text-light);display:flex;gap:12px;flex-wrap:wrap">
          ${p.deadline?`<span>📅 截止 ${p.deadline}</span>`:''}<span>创建于 ${fmtDate(p.createdAt)}</span>
          ${p.note?`<span>📝 ${escHtml(p.note)}</span>`:''}</div></div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
        <select style="font-size:12px;padding:4px 8px;width:auto" onchange="window._updatePlanStatus('${p.id}',this.value)"><option value="未完成" ${p.status==='未完成'?'selected':''}>未完成</option><option value="已完成" ${p.status==='已完成'?'selected':''}>已完成</option><option value="拖延中" ${p.status==='拖延中'?'selected':''}>拖延中</option><option value="已作废" ${p.status==='已作废'?'selected':''}>已作废</option></select>
        <button class="btn btn-ghost btn-sm" onclick="window._openPlanModal('${p.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="window._deletePlan('${p.id}')">🗑</button></div></div>`;
  }).join('');
}

export function openPlanModal(editId, appData, saveAll, renderFn) {
  const plan = editId ? appData.plans.find(p => p.id === editId) : null;
  const content = `
    <div class="form-group"><label class="form-label">计划名称 *</label><input id="planName" value="${plan?escHtml(plan.name):''}" placeholder="输入计划名称"></div>
    <div class="form-group"><label class="form-label">计划详情</label><textarea id="planDetail" rows="3" placeholder="详细描述...">${plan?escHtml(plan.detail||''):''}</textarea></div>
    <div class="form-row"><div class="form-group"><label class="form-label">截止时间</label><input type="date" id="planDeadline" value="${plan?(plan.deadline||''):''}"></div>
    <div class="form-group"><label class="form-label">状态</label><select id="planStatus"><option value="未完成" ${plan&&plan.status==='未完成'?'selected':''}>未完成</option><option value="已完成" ${plan&&plan.status==='已完成'?'selected':''}>已完成</option><option value="拖延中" ${plan&&plan.status==='拖延中'?'selected':''}>拖延中</option><option value="已作废" ${plan&&plan.status==='已作废'?'selected':''}>已作废</option></select></div></div>
    <div class="form-group"><label class="form-label">备注</label><input id="planNote" value="${plan?escHtml(plan.note||''):''}" placeholder="备注信息"></div>`;
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
    appData.plans = appData.plans.filter(p => p.id !== id);
    saveAll(); renderFn(); showToast('计划已删除', 'info');
  });
}
