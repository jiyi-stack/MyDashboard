import { uid, fmtDate, getNow, escHtml, initSwipeActions } from '../utils.js';
import { showModal, showConfirm, showToast } from '../ui-framework.js';
import { iconHTML } from '../icons.js';

const positiveIcons = ['heart', 'book-open', 'dumbbell', 'coffee', 'sprout', 'sun', 'book', 'flag', 'target', 'award'];
const negativeIcons = ['frown-icon', 'ban', 'cloud', 'moon', 'flame', 'alert-triangle', 'x-circle', 'skip-forward', 'pause', 'minus-circle'];

function getHabitColor(habit) {
  return habit.type === '正向' ? 'primary' : 'danger';
}

function getHabitIcon(habit, idx) {
  const icons = habit.type === '正向' ? positiveIcons : negativeIcons;
  return icons[idx % icons.length];
}

export function renderHabits(container, appData, saveAll, habitFilter) {
  let habits = appData.habits.filter(h => !h.deleted);
  if (habitFilter !== '全部') habits = habits.filter(h => h.type === habitFilter);
  const posCount = appData.habits.filter(h => !h.deleted && h.type === '正向').length;
  const negCount = appData.habits.filter(h => !h.deleted && h.type === '负面').length;
  const totalCount = posCount + negCount;

  const avgRating = totalCount 
    ? Math.round(habits.reduce((s, h) => s + (h.rating || 0), 0) / totalCount * 10) / 10 
    : 0;

  container.innerHTML = `
    <div class="habit-page-header">
      <div class="habit-header-left">
        <div class="habit-title">习惯追踪</div>
        <div class="habit-header-desc">研究表明，坚持21天可以初步养成一个习惯，坚持90天则会成为稳定的习惯。加油！</div>
      </div>
    </div>

    <div class="habit-stats-row">
      <div class="habit-stat-card">
        <div class="habit-stat-icon primary">
          ${iconHTML('heart', { color: '#fff', size: 22 })}
        </div>
        <div class="habit-stat-info">
          <div class="habit-stat-label">正向习惯</div>
          <div class="habit-stat-value">${posCount}</div>
        </div>
      </div>
      <div class="habit-stat-card">
        <div class="habit-stat-icon danger">
          ${iconHTML('alert-triangle', { color: '#fff', size: 22 })}
        </div>
        <div class="habit-stat-info">
          <div class="habit-stat-label">负面习惯</div>
          <div class="habit-stat-value">${negCount}</div>
        </div>
      </div>
      <div class="habit-stat-card">
        <div class="habit-stat-icon success">
          ${iconHTML('star', { color: '#fff', size: 22 })}
        </div>
        <div class="habit-stat-info">
          <div class="habit-stat-label">平均评分</div>
          <div class="habit-stat-value">${avgRating}<span class="habit-stat-unit">/5.0</span></div>
        </div>
      </div>
    </div>

    <div class="habit-toolbar">
      <button class="btn btn-outline btn-sm" onclick="window._openHabitModal()">
        ${iconHTML('plus', { size: 16 })} 新增
      </button>
      <div style="flex:1"></div>
      <div class="habit-type-tabs">
        <button class="habit-type-tab ${habitFilter==='全部'?'active':''}" onclick="window._filterHabitType('全部')">
          全部
        </button>
        <button class="habit-type-tab ${habitFilter==='正向'?'active':''}" onclick="window._filterHabitType('正向')">
          正向
        </button>
        <button class="habit-type-tab ${habitFilter==='负面'?'active':''}" onclick="window._filterHabitType('负面')">
          负面
        </button>
      </div>
    </div>

    <div id="habitList"></div>`;

  renderHabitList(habits, appData, saveAll);
}

function renderHabitList(habits, appData, saveAll) {
  const list = document.getElementById('habitList');
  if (!list) return;
  if (!habits.length) { 
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${iconHTML('sprout', { size: 48 })}</div>
        <div class="empty-state-text">暂无习惯记录</div>
        <div class="empty-state-hint">添加一个习惯开始追踪吧</div>
      </div>`; 
    return; 
  }

  list.innerHTML = habits.map((h, idx) => {
    const isPositive = h.type === '正向';
    const color = getHabitColor(h);
    const icon = getHabitIcon(h, idx);
    
    return `
    <div class="swipe-wrap habit-swipe" data-id="${h.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${iconHTML('edit', { color: '#fff', size: 20 })}
        </div>
        <div class="swipe-action-btn delete">
          ${iconHTML('trash', { color: '#fff', size: 20 })}
        </div>
      </div>
      <div class="swipe-card habit-card">
        <div class="habit-card-icon ${color}">
          ${iconHTML(icon, { color: '#fff', size: 20 })}
        </div>
        <div class="habit-card-info">
          <div class="habit-card-top">
            <div class="habit-card-name">${escHtml(h.name)}</div>
            <span class="tag ${isPositive?'tag-positive':'tag-negative'}">${escHtml(h.type)}</span>
          </div>
          ${h.record?`<div class="habit-card-record">${escHtml(h.record)}</div>`:''}
        </div>
        <div class="habit-card-bottom">
          <div class="habit-card-rating">
            <div class="star-rating-mini">
              ${[1,2,3,4,5].map(s => `<span class="star-mini ${s<=h.rating?'active':''}" onclick="event.stopPropagation();window._updateHabitRating('${h.id}',${s})"></span>`).join('')}
            </div>
            <span class="habit-rating-text">${h.rating || 0} 星</span>
          </div>
          <div class="habit-card-date">
            ${iconHTML('calendar', { size: 12 })} ${fmtDate(h.createdAt)}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  initSwipeActions(list, {
    onEdit: (id) => window._openHabitModal(id),
    onDelete: (id) => window._deleteHabit(id)
  });
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
    <div class="form-group">
      <label class="form-label">习惯名称 *</label>
      <input id="hName" value="${habit?escHtml(habit.name):''}" placeholder="输入习惯名称">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">习惯类型</label>
        <select id="hType">
          <option value="正向" ${habit&&habit.type==='正向'?'selected':''}>正向习惯</option>
          <option value="负面" ${habit&&habit.type==='负面'?'selected':''}>负面习惯</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">星级评分</label>
        <div id="hRatingStars" class="star-rating" style="font-size:28px">
          ${[1,2,3,4,5].map(s => `<span class="star ${(habit?habit.rating:3)>=s?'active':''}" data-r="${s}">★</span>`).join('')}
        </div>
        <input type="hidden" id="hRating" value="${habit?habit.rating:3}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">养成记录</label>
      <textarea id="hRecord" rows="3" placeholder="记录习惯养成过程...">${habit?escHtml(habit.record||''):''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <input id="hNote" value="${habit?escHtml(habit.note||''):''}" placeholder="备注">
    </div>`;
  
  const modal = showModal(habit?'编辑习惯':'新增习惯', content + `
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-primary save-btn">保存</button>
    </div>`);

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
      id: habit ? habit.id : uid(), 
      name,
      type: modal.getEl('#hType').value,
      rating: parseInt(modal.getEl('#hRating').value),
      record: modal.getEl('#hRecord').value.trim(),
      note: modal.getEl('#hNote').value.trim(),
      createdAt: habit ? habit.createdAt : getNow(),
      updatedAt: getNow()
    };
    if (habit) { 
      appData.habits[appData.habits.findIndex(h => h.id === editId)] = data; 
    } else { 
      appData.habits.push(data); 
    }
    saveAll(); modal.close(); renderFn();
    showToast('习惯已保存', 'success');
  };
}

export function deleteHabit(id, appData, saveAll, renderFn) {
  showConfirm('删除习惯', '确定要删除这个习惯吗？', () => {
    const idx = appData.habits.findIndex(h => h.id === id);
    if (idx >= 0) {
      appData.habits[idx].deleted = true;
      appData.habits[idx].updatedAt = new Date().toISOString();
    }
    saveAll(); renderFn(); 
    showToast('习惯已删除', 'info');
  });
}
