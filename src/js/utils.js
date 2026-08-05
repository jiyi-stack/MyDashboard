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
