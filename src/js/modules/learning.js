import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, initSwipeActions } from '../utils.js';
import { showModal, showConfirm, showToast, showEncourage, createCustomSelect } from '../ui-framework.js';
import { iconHTML } from '../icons.js';

export function renderLearning(container, appData, saveAll, currentMonth) {
  let records = appData.learning.filter(l => !l.deleted);
  if (currentMonth) records = records.filter(l => monthMatch(l.studyTime, currentMonth));
  records.sort((a, b) => (b.studyTime||'').localeCompare(a.studyTime||'') || (b.createdAt||'').localeCompare(a.createdAt||''));
  const totalCount = appData.learning.filter(l => !l.deleted).length;
  const monthCount = records.length;

  container.innerHTML = `
    <div class="learning-page-header">
      <div class="learning-title">学习记录</div>
      <div class="learning-subtitle">记录每一次成长 · 共 ${totalCount} 条</div>
    </div>

    <div class="learning-stats-row">
      <div class="learning-stat-card blue">
        <div class="learning-stat-icon blue">
          ${iconHTML('book-open', { color: '#fff', size: 24 })}
        </div>
        <div class="learning-stat-info">
          <div class="learning-stat-label">本月学习</div>
          <div class="learning-stat-value">${monthCount}<span class="learning-stat-sub">次学习记录</span></div>
        </div>
      </div>
      <div class="learning-stat-card purple">
        <div class="learning-stat-icon purple">
          ${iconHTML('graduation-cap', { color: '#fff', size: 24 })}
        </div>
        <div class="learning-stat-info">
          <div class="learning-stat-label">累计学习</div>
          <div class="learning-stat-value">${totalCount}<span class="learning-stat-sub">条记录</span></div>
        </div>
      </div>
      <div class="learning-stat-card green">
        <div class="learning-stat-icon green">
          ${iconHTML('award', { color: '#fff', size: 24 })}
        </div>
        <div class="learning-stat-info">
          <div class="learning-stat-label">连续学习</div>
          <div class="learning-stat-value">${Math.min(monthCount, 7)} <span class="learning-stat-rate">天</span><span class="learning-stat-sub">继续加油</span></div>
        </div>
      </div>
    </div>

    <div class="learning-toolbar">
      <button class="btn btn-outline btn-sm" onclick="window._openLearningModal()">
        ${iconHTML('plus', { size: 16 })} 新增
      </button>
      <div style="flex:1"></div>
      <div class="learning-filter-bar">
        <div id="learnMonthFilter"></div>
      </div>
    </div>

    <div id="learnList"></div>`;

  const monthItems = [{ value: '', label: '全部时间' }, ...getMonths().map(m => ({ value: m, label: monthLabel(m) }))];
  const monthSelect = createCustomSelect({
    id: 'learnMonthSelect',
    value: currentMonth || '',
    items: monthItems,
    size: 'sm',
    variant: 'text',
    align: 'right',
    onChange: (val) => { window._filterLearnMonth(val); }
  });
  document.getElementById('learnMonthFilter').appendChild(monthSelect.el);

  renderLearnList(records);
}

function renderLearnList(records) {
  const list = document.getElementById('learnList');
  if (!list) return;
  if (!records.length) { 
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${iconHTML('book-open', { size: 48 })}</div>
        <div class="empty-state-text">暂无学习记录</div>
        <div class="empty-state-hint">记录你的学习过程，见证每一天的成长</div>
      </div>`; 
    return; 
  }
  list.innerHTML = records.map(r => `
    <div class="swipe-wrap" data-id="${r.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${iconHTML('edit', { color: '#fff', size: 20 })}
        </div>
        <div class="swipe-action-btn delete">
          ${iconHTML('trash', { color: '#fff', size: 20 })}
        </div>
      </div>
      <div class="swipe-card learning-card">
        <div class="learning-card-icon">
          ${iconHTML('book-open', { color: '#fff', size: 22 })}
        </div>
        <div class="learning-card-content">
          <div class="learning-card-title">${escHtml(r.topic)}</div>
          <div class="learning-card-desc">${escHtml((r.content||'').slice(0,100))}</div>
          ${r.images&&r.images.length?`
          <div class="learning-card-images">
            ${r.images.slice(0,3).map(img => `<img src="${img}" class="learning-card-img">`).join('')}
            ${r.images.length>3?`<span class="learning-card-more">+${r.images.length-3}</span>`:''}
          </div>`:''}
          <div class="learning-card-meta">
            <span class="learning-meta-item">
              ${iconHTML('calendar', { size: 12 })}
              ${r.studyTime}
            </span>
            ${r.result?`
            <span class="learning-meta-item">
              ${iconHTML('award', { size: 12 })}
              ${escHtml(r.result)}
            </span>`:''}
          </div>
        </div>
        <div class="learning-card-arrow">
          ${iconHTML('chevron-right', { size: 18, color: 'var(--text-tertiary)' })}
        </div>
      </div>
    </div>`).join('');

  initSwipeActions(list, {
    onEdit: (id) => window._openLearningModal(id),
    onDelete: (id) => window._deleteLearning(id),
    onClick: (id) => window._openLearningModal(id)
  });
}

export function openLearningModal(editId, appData, saveAll, renderFn) {
  const record = editId ? appData.learning.find(l => l.id === editId) : null;
  let imgDataUrls = record && record.images ? [...record.images] : [];

  let contentHtml = `
    <div class="form-group">
      <label class="form-label">学习主题 *</label>
      <input id="lTopic" value="${record?escHtml(record.topic):''}" placeholder="今天学了什么？">
    </div>
    <div class="form-group">
      <label class="form-label">学习内容</label>
      <textarea id="lContent" rows="4" placeholder="详细描述你的学习内容...">${record?escHtml(record.content||''):''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">学习成果</label>
      <input id="lResult" value="${record?escHtml(record.result||''):''}" placeholder="有什么收获？">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">学习时间</label>
        <input type="date" id="lTime" value="${record?record.studyTime:getToday()}">
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <input id="lNote" value="${record?escHtml(record.note||''):''}" placeholder="备注">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">配图</label>
      <div class="img-upload-area" id="imgUploadArea">
        ${iconHTML('image', { size: 24 })} 点击或拖拽上传图片
      </div>
      <input type="file" id="imgInput" accept="image/*" multiple style="display:none">
      <div class="img-preview" id="imgPreview"></div>
    </div>`;

  const modal = showModal(record?'编辑学习记录':'新增学习记录', contentHtml + `
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-primary save-btn">保存</button>
    </div>`);

  function refreshPreviews() {
    modal.getEl('#imgPreview').innerHTML = imgDataUrls.map((url, i) => `
      <div class="img-preview-item">
        <img src="${url}">
        <button class="img-remove" onclick="event.stopPropagation();window._removeLearnImg(${i})">×</button>
      </div>`).join('');
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
      images: [...imgDataUrls],
      createdAt: record ? record.createdAt : getNow(),
      updatedAt: getNow()
    };
    if (record) { appData.learning[appData.learning.findIndex(l => l.id === editId)] = data; }
    else { appData.learning.unshift(data); }
    saveAll(); modal.close(); renderFn();
    showToast('学习记录已保存', 'success');
    showEncourage();
  };
}

export function deleteLearning(id, appData, saveAll, renderFn) {
  showConfirm('删除记录', '确定要删除这条学习记录吗？此操作不可撤销。', () => {
    const idx = appData.learning.findIndex(l => l.id === id);
    if (idx >= 0) {
      appData.learning[idx].deleted = true;
      appData.learning[idx].updatedAt = new Date().toISOString();
    }
    saveAll(); renderFn(); showToast('学习记录已删除', 'info');
  });
}
