// ========================================
// UTILITIES — shared helpers
// ========================================

export function uid() { return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
export function fmtDate(d) { if(!d) return ''; const ds = d instanceof Date ? d.toISOString() : String(d); const dt = new Date(ds.includes('T') ? ds : ds+'T00:00:00'); if(isNaN(dt.getTime())) return ''; return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`; }
export function fmtDateTime(d) { if(!d) return ''; return fmtDate(d)+' '+new Date(d).toTimeString().slice(0,5); }
export function getToday() { return fmtDate(new Date()); }
export function getNow() { return new Date().toISOString(); }
export function monthMatch(d, month) { return (d||'').startsWith(month); }
export function escHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

export function getMonths(n=12) {
  const m=[]; const now=new Date();
  for(let i=0;i<n;i++){ const d=new Date(now.getFullYear(),now.getMonth()-i,1); m.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`); }
  return m;
}

export function monthLabel(m) { const [y,p] = m.split('-'); return `${y}年${parseInt(p)}月`; }

export function randomPick(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

export function getStatusTag(status) {
  const map = { 未完成:'tag-todo', 已完成:'tag-done', 拖延中:'tag-delay', 已作废:'tag-cancel', 即将开始:'tag-upcoming' };
  return `<span class="tag ${map[status]||''}">${escHtml(status)}</span>`;
}

// Encouragement phrases
const ENCOURAGE_DONE = [
  '太棒了！又完成了一项！🎉','坚持就是胜利，继续加油！💪','每一步都算数～🌟','做得真好，为自己骄傲！✨',
  '今天的你很优秀！🔥','完成的感觉真不错吧～😊','又在成长的路上前进了一步 🌱','你就是效率达人！⚡'
];
const ENCOURAGE_REMIND = [
  '别担心，慢慢来～调整一下状态 🍃','偶尔的拖延也是自我调节，重新出发吧 🌿',
  '计划赶不上变化，灵活调整就好 😌','给自己一点时间，你已经在路上了 💛'
];
const LEARN_ENC = [
  '每一次学习都在塑造更好的自己 📚','知识的积累让你越来越强大 🌟',
  '学无止境，你今天又进步了！🎓','保持好奇心，这是最珍贵的品质 💡'
];

export function getEncourage(type) {
  if (type==='done') return randomPick(ENCOURAGE_DONE);
  if (type==='remind') return randomPick(ENCOURAGE_REMIND);
  if (type==='learn') return randomPick(LEARN_ENC);
  return randomPick(ENCOURAGE_DONE);
}

// Finance categories
export const FINANCE_CATEGORIES = {
  收入:['工资','奖金','兼职','投资','其他收入'],
  支出:['餐饮','交通','购物','住房','娱乐','医疗','教育','其他支出']
};

// ========================================
// SWIPE — generic swipe-to-reveal actions (编辑/删除)
// 卡片结构需为：.swipe-wrap > (.swipe-actions > .swipe-action-btn[data-action]) + .swipe-card
// ========================================
export function initSwipeActions(container, {
  actionWidth = 144,
  dragThreshold = 6,
  onEdit = null,
  onDelete = null,
  onClick = null
} = {}) {
  const wraps = Array.from(container.querySelectorAll('.swipe-wrap'));
  let activeWrap = null;

  function closeAll() {
    wraps.forEach(w => {
      const card = w.querySelector('.swipe-card');
      if (card && card.classList.contains('swiped')) {
        card.classList.remove('swiped');
        card.style.transform = '';
      }
    });
    activeWrap = null;
  }

  wraps.forEach(wrap => {
    const card = wrap.querySelector('.swipe-card');
    if (!card) return;
    const id = wrap.dataset.id;
    const editBtn = wrap.querySelector('.swipe-action-btn[data-action="edit"]');
    const deleteBtn = wrap.querySelector('.swipe-action-btn[data-action="delete"]');
    const isInteractive = (t) => t.closest('button, a, .toggle, .dropdown, .star-mini');

    if (editBtn) editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAll();
      if (onEdit) onEdit(id, wrap, e);
    });
    if (deleteBtn) deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAll();
      if (onDelete) onDelete(id, wrap, e);
    });

    let startX = 0, currentX = 0, touchDragging = false, mouseDragging = false, preventClick = false;

    // ── Touch ──
    card.addEventListener('touchstart', (e) => {
      if (isInteractive(e.target)) return;
      startX = e.touches[0].clientX;
      currentX = startX;
      touchDragging = false;
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      const delta = currentX - startX;
      if (Math.abs(delta) > dragThreshold) { touchDragging = true; preventClick = true; }
      if (touchDragging) {
        if (activeWrap && activeWrap !== wrap) {
          const ac = activeWrap.querySelector('.swipe-card');
          ac.classList.remove('swiped');
          ac.style.transform = '';
        }
        let translateX = delta;
        if (card.classList.contains('swiped')) translateX = -actionWidth + delta;
        if (translateX > 0) translateX = 0;
        if (translateX < -actionWidth - 20) translateX = -actionWidth - 20;
        card.style.transform = `translateX(${translateX}px)`;
      }
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transition = '';
      if (!touchDragging) return;
      const delta = currentX - startX;
      let offset = delta;
      if (card.classList.contains('swiped')) offset = -actionWidth + delta;
      if (offset < -actionWidth / 3) {
        card.classList.add('swiped');
        card.style.transform = '';
        activeWrap = wrap;
      } else {
        card.classList.remove('swiped');
        card.style.transform = '';
        if (activeWrap === wrap) activeWrap = null;
      }
      touchDragging = false;
      setTimeout(() => { preventClick = false; }, 300);
    });

    // ── Mouse ──
    let mouseStartX = 0, mouseCurrentX = 0;
    card.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || isInteractive(e.target)) return;
      mouseStartX = e.clientX;
      mouseCurrentX = mouseStartX;
      mouseDragging = false;
      card.style.transition = 'none';
      card.style.cursor = 'grabbing';

      const onMove = (ev) => {
        mouseCurrentX = ev.clientX;
        const delta = mouseCurrentX - mouseStartX;
        if (Math.abs(delta) > dragThreshold) { mouseDragging = true; preventClick = true; }
        if (mouseDragging) {
          if (activeWrap && activeWrap !== wrap) {
            const ac = activeWrap.querySelector('.swipe-card');
            ac.classList.remove('swiped');
            ac.style.transform = '';
          }
          let translateX = delta;
          if (card.classList.contains('swiped')) translateX = -actionWidth + delta;
          if (translateX > 0) translateX = 0;
          if (translateX < -actionWidth - 20) translateX = -actionWidth - 20;
          card.style.transform = `translateX(${translateX}px)`;
        }
      };
      const onUp = () => {
        card.style.transition = '';
        card.style.cursor = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        if (!mouseDragging) return;
        const delta = mouseCurrentX - mouseStartX;
        let offset = delta;
        if (card.classList.contains('swiped')) offset = -actionWidth + delta;
        if (offset < -actionWidth / 3) {
          card.classList.add('swiped');
          card.style.transform = '';
          activeWrap = wrap;
        } else {
          card.classList.remove('swiped');
          card.style.transform = '';
          if (activeWrap === wrap) activeWrap = null;
        }
        mouseDragging = false;
        setTimeout(() => { preventClick = false; }, 300);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    card.addEventListener('click', (e) => {
      if (preventClick) {
        e.preventDefault();
        e.stopPropagation();
        preventClick = false;
        return;
      }
      if (card.classList.contains('swiped')) {
        e.preventDefault();
        e.stopPropagation();
        closeAll();
      } else if (onClick) {
        onClick(id, wrap, e);
      }
    });
  });

  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.swipe-wrap')) closeAll();
  }, { passive: true });
  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.swipe-wrap')) closeAll();
  });
}
