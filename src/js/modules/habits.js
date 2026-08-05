// ========================================
// 习惯追踪模块
// ========================================
import { uid, fmtDate, getNow, escHtml } from '../utils.js';
import { showModal, showConfirm, showToast } from '../ui-framework.js';

export function renderHabits(container, appData, saveAll, habitFilter) {
  let habits = [...appData.habits];
  if (habitFilter !== '全部') habits = habits.filter(h => h.type === habitFilter);
  const posCount = appData.habits.filter(h => h.type === '正向').length;
  const negCount = appData.habits.filter(h => h.type === '负面').length;

  container.innerHTML = `
    <div class="page-title">习惯追踪</div>
    <div class="page-subtitle">培养好习惯，改善坏习惯 · 正向 ${posCount} · 负面 ${negCount}</div>
    <div class="type-tabs">
      <button class="type-tab ${habitFilter==='全部'?'active':''}" onclick="window._filterHabitType('全部')">全部</button>
      <button class="type-tab ${habitFilter==='正向'?'active':''}" onclick="window._filterHabitType('正向')">✨ 正向习惯</button>
      <button class="type-tab ${habitFilter==='负面'?'active':''}" onclick="window._filterHabitType('负面')">⚠️ 负面习惯</button></div>
    <div class="list" id="habitList"></div>`;

  renderHabitList(habits, appData, saveAll);
}

function renderHabitList(habits, appData, saveAll) {
  const list = document.getElementById('habitList');
  if (!list) return;
  if (!habits.length) { list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🌱</div><div class="empty-state-text">暂无习惯记录</div><div class="empty-state-hint">添加一个习惯开始追踪吧</div></div>`; return; }
  list.innerHTML = habits.map(h => {
    const isPositive = h.type === '正向';
    return `
    <div class="card" style="display:flex;align-items:center;gap:14px">
      <div style="font-size:32px;flex-shrink:0">${isPositive?'✨':'⚠️'}</div>
      <div class="habit-info">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="habit-name">${escHtml(h.name)}</span><span class="tag ${isPositive?'tag-positive':'tag-negative'}">${escHtml(h.type)}</span></div>
        <div class="habit-meta"><div class="star-rating" style="font-size:20px">${[1,2,3,4,5].map(s => `<span class="star ${s<=h.rating?'active':''}" onclick="event.stopPropagation();window._updateHabitRating('${h.id}',${s})">★</span>`).join('')}</div></div>
        ${h.record?`<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">📝 ${escHtml(h.record)}</div>`:''}
        <div style="font-size:11px;color:var(--text-light);margin-top:2px">创建于 ${fmtDate(h.createdAt)}</div></div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
        <button class="btn btn-ghost btn-sm" onclick="window._openHabitModal('${h.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="window._deleteHabit('${h.id}')">🗑</button></div></div>`;
  }).join('');
}

export function updateHabitRating(id, rating, appData, saveAll, renderFn) {
  const habit = appData.habits.find(h => h.id === id);
  if (!habit) return;
  habit.rating = rating;
  saveAll(); renderFn();
  showToast(`评分已更新为 ${rating} 星`, 'success', '⭐');
}

export function openHabitModal(editId, appData, saveAll, renderFn) {
  const habit = editId ? appData.habits.find(h => h.id === editId) : null;
  const content = `
    <div class="form-group"><label class="form-label">习惯名称 *</label><input id="hName" value="${habit?escHtml(habit.name):''}" placeholder="输入习惯名称"></div>
    <div class="form-row"><div class="form-group"><label class="form-label">习惯类型</label><select id="hType"><option value="正向" ${habit&&habit.type==='正向'?'selected':''}>✨ 正向习惯</option><option value="负面" ${habit&&habit.type==='负面'?'selected':''}>⚠️ 负面习惯</option></select></div>
    <div class="form-group"><label class="form-label">星级评分</label><div id="hRatingStars" class="star-rating" style="font-size:28px">${[1,2,3,4,5].map(s => `<span class="star ${(habit?habit.rating:3)>=s?'active':''}" data-r="${s}">★</span>`).join('')}</div><input type="hidden" id="hRating" value="${habit?habit.rating:3}"></div></div>
    <div class="form-group"><label class="form-label">养成记录</label><textarea id="hRecord" rows="3" placeholder="记录习惯养成过程...">${habit?escHtml(habit.record||''):''}</textarea></div>
    <div class="form-group"><label class="form-label">备注</label><input id="hNote" value="${habit?escHtml(habit.note||''):''}" placeholder="备注"></div>`;
  const modal = showModal(habit?'编辑习惯':'新增习惯', content + `<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>`);

  modal.getAll('#hRatingStars .star').forEach(star => {
    star.onclick = function() {
      const r = parseInt(this.dataset.r);
      modal.getEl('#hRating').value = r;
      modal.getAll('#hRatingStars .star').forEach((s, i) => { s.classList.toggle('active', i < r); });
    };
  });

  modal.getEl('.cancel-btn').onclick = modal.close;
  modal.getEl('.save-btn').onclick = () => {
    const name = modal.getEl('#hName').value.trim();
    if (!name) { showToast('请输入习惯名称', 'warning'); return; }
    const data = {
      id: habit ? habit.id : uid(), name,
      type: modal.getEl('#hType').value,
      rating: parseInt(modal.getEl('#hRating').value),
      record: modal.getEl('#hRecord').value.trim(),
      note: modal.getEl('#hNote').value.trim(),
      createdAt: habit ? habit.createdAt : getNow()
    };
    if (habit) { appData.habits[appData.habits.findIndex(h => h.id === editId)] = data; }
    else { appData.habits.push(data); }
    saveAll(); modal.close(); renderFn();
    showToast('习惯已保存', 'success');
  };
}

export function deleteHabit(id, appData, saveAll, renderFn) {
  showConfirm('删除习惯', '确定要删除这个习惯吗？', () => {
    appData.habits = appData.habits.filter(h => h.id !== id);
    saveAll(); renderFn(); showToast('习惯已删除', 'info');
  });
}
