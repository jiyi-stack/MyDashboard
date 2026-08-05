// ========================================
// 学习记录模块
// ========================================
import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel } from '../utils.js';
import { showModal, showConfirm, showToast, showEncourage } from '../ui-framework.js';

export function renderLearning(container, appData, saveAll, currentMonth) {
  let records = [...appData.learning];
  if (currentMonth) records = records.filter(l => monthMatch(l.studyTime, currentMonth));
  records.sort((a, b) => (b.studyTime||'').localeCompare(a.studyTime||'') || (b.createdAt||'').localeCompare(a.createdAt||''));

  container.innerHTML = `
    <div class="page-title">学习记录</div>
    <div class="page-subtitle">记录每一次成长 · 共 ${appData.learning.length} 条</div>
    <div class="filter-bar"><select id="learnMonthFilter"><option value="">全部时间</option>${getMonths().map(m => `<option value="${m}" ${m===currentMonth?'selected':''}>${monthLabel(m)}</option>`).join('')}</select></div>
    <div class="stat-grid" style="margin-bottom:16px">
      <div class="stat-card"><div class="stat-card-label">本月学习</div><div class="stat-card-value">${records.length}</div><div class="stat-card-sub">次记录</div></div>
      <div class="stat-card"><div class="stat-card-label">总计学习</div><div class="stat-card-value">${appData.learning.length}</div><div class="stat-card-sub">条记录</div></div></div>
    <div class="list" id="learnList"></div>`;

  document.getElementById('learnMonthFilter').onchange = function() { window._filterLearnMonth(this.value); };
  renderLearnList(records);
}

function renderLearnList(records) {
  const list = document.getElementById('learnList');
  if (!list) return;
  if (!records.length) { list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📖</div><div class="empty-state-text">暂无学习记录</div><div class="empty-state-hint">记录你的学习过程，见证每一天的成长</div></div>`; return; }
  list.innerHTML = records.map(r => `
    <div class="card" style="cursor:pointer" onclick="window._openLearningModal('${r.id}')">
      <div style="font-size:15px;font-weight:600;margin-bottom:4px">${escHtml(r.topic)}</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${escHtml((r.content||'').slice(0,150))}</div>
      ${r.images&&r.images.length?`<div style="display:flex;gap:6px;margin-bottom:8px">${r.images.slice(0,3).map(img => `<img src="${img}" style="width:60px;height:60px;border-radius:var(--radius-sm);object-fit:cover">`).join('')}${r.images.length>3?`<span style="font-size:12px;color:var(--text-light);align-self:center">+${r.images.length-3}</span>`:''}</div>`:''}
      <div style="font-size:12px;color:var(--text-light);display:flex;gap:12px"><span>📅 ${r.studyTime}</span>${r.result?`<span>🏆 ${escHtml(r.result)}</span>`:''}</div></div>`).join('');
}

export function openLearningModal(editId, appData, saveAll, renderFn) {
  const record = editId ? appData.learning.find(l => l.id === editId) : null;
  let imgDataUrls = record && record.images ? [...record.images] : [];

  let contentHtml = `
    <div class="form-group"><label class="form-label">学习主题 *</label><input id="lTopic" value="${record?escHtml(record.topic):''}" placeholder="今天学了什么？"></div>
    <div class="form-group"><label class="form-label">学习内容</label><textarea id="lContent" rows="4" placeholder="详细描述你的学习内容...">${record?escHtml(record.content||''):''}</textarea></div>
    <div class="form-group"><label class="form-label">学习成果</label><input id="lResult" value="${record?escHtml(record.result||''):''}" placeholder="有什么收获？"></div>
    <div class="form-row"><div class="form-group"><label class="form-label">学习时间</label><input type="date" id="lTime" value="${record?record.studyTime:getToday()}"></div>
    <div class="form-group"><label class="form-label">备注</label><input id="lNote" value="${record?escHtml(record.note||''):''}" placeholder="备注"></div></div>
    <div class="form-group"><label class="form-label">配图</label><div class="img-upload-area" id="imgUploadArea">🖼️ 点击或拖拽上传图片</div>
    <input type="file" id="imgInput" accept="image/*" multiple style="display:none"><div class="img-preview" id="imgPreview"></div></div>`;

  const modal = showModal(record?'编辑学习记录':'新增学习记录', contentHtml + `<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>`);

  function refreshPreviews() {
    modal.getEl('#imgPreview').innerHTML = imgDataUrls.map((url, i) => `
      <div class="img-preview-item"><img src="${url}"><button class="img-remove" onclick="event.stopPropagation();window._removeLearnImg(${i})">×</button></div>`).join('');
  }
  refreshPreviews();

  modal.getEl('#imgUploadArea').onclick = () => modal.getEl('#imgInput').click();
  modal.getEl('#imgInput').onchange = function() {
    Array.from(this.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => { imgDataUrls.push(e.target.result); refreshPreviews(); };
      reader.readAsDataURL(file);
    });
    this.value = '';
  };

  window._removeLearnImg = (i) => { imgDataUrls.splice(i, 1); refreshPreviews(); };

  modal.getEl('.cancel-btn').onclick = modal.close;
  modal.getEl('.save-btn').onclick = () => {
    const topic = modal.getEl('#lTopic').value.trim();
    if (!topic) { showToast('请输入学习主题', 'warning'); return; }
    const data = {
      id: record ? record.id : uid(), topic,
      content: modal.getEl('#lContent').value.trim(),
      result: modal.getEl('#lResult').value.trim(),
      studyTime: modal.getEl('#lTime').value,
      note: modal.getEl('#lNote').value.trim(),
      images: imgDataUrls,
      createdAt: record ? record.createdAt : getNow()
    };
    if (record) { appData.learning[appData.learning.findIndex(l => l.id === editId)] = data; }
    else { appData.learning.unshift(data); }
    saveAll(); modal.close(); renderFn();
    showEncourage('learn');
  };
}
