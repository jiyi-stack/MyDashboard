// ========================================
// 个人记账账本模块
// ========================================
import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, FINANCE_CATEGORIES } from '../utils.js';
import { showModal, showConfirm, showToast } from '../ui-framework.js';

// Import Chart dynamically when needed

export function renderFinance(container, appData, saveAll, currentMonth) {
  const monthFilter = currentMonth;
  let records = appData.finance.filter(f => monthMatch(f.date, monthFilter));
  records.sort((a, b) => (b.date||'').localeCompare(a.date||'') || (b.createdAt||'').localeCompare(a.createdAt||''));
  const incomeTotal = records.filter(f => f.type === '收入').reduce((s, f) => s + (f.amount||0), 0);
  const expenseTotal = records.filter(f => f.type === '支出').reduce((s, f) => s + (f.amount||0), 0);
  const net = incomeTotal - expenseTotal;

  container.innerHTML = `
    <div class="page-title">记账账本</div>
    <div class="page-subtitle">${monthLabel(monthFilter)} · 理性消费，心中有数</div>
    <div class="filter-bar"><select id="finMonthFilter">${getMonths().map(m => `<option value="${m}" ${m===monthFilter?'selected':''}>${monthLabel(m)}</option>`).join('')}</select></div>
    <div class="stat-grid" style="margin-bottom:16px">
      <div class="stat-card" style="border-left:4px solid var(--primary)"><div class="stat-card-label">📥 收入</div><div class="stat-card-value" style="color:var(--primary-deep)">¥${incomeTotal.toLocaleString()}</div></div>
      <div class="stat-card" style="border-left:4px solid var(--accent)"><div class="stat-card-label">📤 支出</div><div class="stat-card-value" style="color:var(--accent-deep)">¥${expenseTotal.toLocaleString()}</div></div>
      <div class="stat-card" style="border-left:4px solid ${net>=0?'var(--primary)':'var(--accent)'}"><div class="stat-card-label">💡 净收支</div><div class="stat-card-value" style="color:${net>=0?'var(--primary-deep)':'var(--accent-deep)'}">${net>=0?'+':''}¥${net.toLocaleString()}</div></div></div>
    <div class="chart-row" style="margin-bottom:20px">
      <div class="chart-card"><div class="section-title">支出分类占比</div><div class="chart-wrap"><canvas id="finPieChart" style="max-height:260px"></canvas></div></div>
      <div class="chart-card"><div class="section-title">每日收支趋势</div><div class="chart-wrap"><canvas id="finBarChart" style="max-height:260px"></canvas></div></div></div>
    ${records.length ? `<div style="text-align:center;padding:12px 20px;margin-bottom:20px;background:var(--surface);border-radius:var(--radius-lg);font-size:13px;color:var(--text-secondary)">${generateFinanceSummary(incomeTotal, expenseTotal, net, records)}</div>` : ''}
    <div class="section-title">收支明细</div><div class="list" id="finList"></div>`;

  document.getElementById('finMonthFilter').onchange = function() { window._filterFinMonth(this.value); };
  renderFinanceList(records);
  renderFinanceCharts(records);
}

function generateFinanceSummary(income, expense, net, records) {
  if (!records.length) return '📝 本月暂无收支记录';
  const rate = income > 0 ? Math.round(expense / income * 100) : 0;
  let advice = '';
  if (rate < 50) advice = '储蓄率优秀，继续保持理性消费的好习惯！🌟';
  else if (rate < 80) advice = '支出比例适中，可以适当关注非必要消费 💡';
  else if (rate < 100) advice = '本月支出偏高，建议审视消费结构，合理规划 🍃';
  else advice = '本月入不敷出，需要特别注意消费习惯哦 ⚠️';
  return `本月消费总结：收支比 ${rate}%，净${net>=0?'结余':'超支'} ¥${Math.abs(net).toLocaleString()}。${advice}`;
}

function renderFinanceList(records) {
  const list = document.getElementById('finList');
  if (!list) return;
  if (!records.length) { list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💰</div><div class="empty-state-text">本月暂无收支记录</div><div class="empty-state-hint">开始记录你的每一笔收支吧</div></div>`; return; }
  list.innerHTML = records.map(f => `
    <div class="card" style="display:flex;align-items:center;gap:14px">
      <div class="cat-icon" style="background:${f.type==='收入'?'var(--primary-light)':'var(--accent-light)'}">${f.type==='收入'?'📥':'📤'}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span style="font-size:15px;font-weight:600">${escHtml(f.scene||f.category)}</span><span class="tag ${f.type==='收入'?'tag-income':'tag-expense'}">${escHtml(f.category)}</span></div>
        <div style="font-size:12px;color:var(--text-light);display:flex;gap:12px;margin-top:2px"><span>📅 ${f.date}</span>${f.note?`<span>📝 ${escHtml(f.note)}</span>`:''}</div></div>
      <div style="font-size:17px;font-weight:700;color:${f.type==='收入'?'var(--primary-deep)':'var(--accent-deep)'};flex-shrink:0">${f.type==='收入'?'+':'-'}¥${(f.amount||0).toLocaleString()}</div>
      <div style="display:flex;gap:4px;flex-shrink:0">
        <button class="btn btn-ghost btn-sm" onclick="window._openFinanceModal('${f.id}')">✏️</button>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="window._deleteFinance('${f.id}')">🗑</button></div></div>`).join('');
}

function renderFinanceCharts(records) {
  setTimeout(async () => {
    const Chart = (await import('chart.js/auto')).default;
    // Clean up old charts
    if (window._finChartInstances) {
      Object.values(window._finChartInstances).forEach(c => c.destroy());
    }
    window._finChartInstances = {};

    const expenses = records.filter(f => f.type === '支出');
    const catMap = {}; expenses.forEach(f => { catMap[f.category] = (catMap[f.category]||0) + (f.amount||0); });
    const catLabels = Object.keys(catMap); const catValues = Object.values(catMap);

    const pieCtx = document.getElementById('finPieChart');
    if (pieCtx && catLabels.length) {
      window._finChartInstances.pie = new Chart(pieCtx, {
        type: 'doughnut', data: { labels: catLabels, datasets: [{ data: catValues, backgroundColor: ['#9BB5A3','#D4A9A6','#8BA5B5','#E8C8A0','#C9A0A0','#B5C9A0','#A0B5C9','#C9B5A0'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
      });
    } else if (pieCtx) {
      const c = pieCtx.getContext('2d'); c.font = '14px sans-serif'; c.fillStyle = '#8C8C8C'; c.textAlign = 'center';
      c.fillText('本月暂无支出数据', 150, 130);
    }

    const dailyMap = {}; records.forEach(f => {
      if (!dailyMap[f.date]) dailyMap[f.date] = { income: 0, expense: 0 };
      if (f.type === '收入') dailyMap[f.date].income += (f.amount||0);
      else dailyMap[f.date].expense += (f.amount||0);
    });
    const days = Object.keys(dailyMap).sort();
    const barCtx = document.getElementById('finBarChart');
    if (barCtx && days.length) {
      window._finChartInstances.bar = new Chart(barCtx, {
        type: 'bar', data: {
          labels: days.map(d => d.slice(8)),
          datasets: [
            { label: '收入', data: days.map(d => dailyMap[d].income), backgroundColor: '#9BB5A3', borderRadius: 4 },
            { label: '支出', data: days.map(d => dailyMap[d].expense), backgroundColor: '#D4A9A6', borderRadius: 4 }
          ]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12 } } } }
      });
    }
  }, 300);
}

export function openFinanceModal(editId, appData, saveAll, renderFn) {
  const record = editId ? appData.finance.find(f => f.id === editId) : null;
  let finImgData = record && record.image ? record.image : '';
  let contentHtml = `
    <div class="form-row"><div class="form-group"><label class="form-label">类型</label><select id="fType"><option value="支出" ${record&&record.type==='支出'?'selected':''}>支出</option><option value="收入" ${record&&record.type==='收入'?'selected':''}>收入</option></select></div>
    <div class="form-group"><label class="form-label">金额 *</label><input type="number" id="fAmount" value="${record?record.amount:''}" placeholder="0.00" step="0.01" min="0"></div></div>
    <div class="form-row"><div class="form-group"><label class="form-label">分类</label><select id="fCategory"></select></div>
    <div class="form-group"><label class="form-label">日期</label><input type="date" id="fDate" value="${record?record.date:getToday()}"></div></div>
    <div class="form-group"><label class="form-label">消费场景</label><input id="fScene" value="${record?escHtml(record.scene||''):''}" placeholder="描述这笔收支"></div>
    <div class="form-group"><label class="form-label">备注</label><input id="fNote" value="${record?escHtml(record.note||''):''}" placeholder="备注信息"></div>
    <div class="form-group"><label class="form-label">图片凭证（可选）</label><div class="img-upload-area" id="finImgUpload">🖼️ 点击上传凭证</div>
    <input type="file" id="finImgInput" accept="image/*" style="display:none"><div class="img-preview" id="finImgPreview">${finImgData?`<div class="img-preview-item"><img src="${finImgData}"><button class="img-remove" onclick="event.stopPropagation();window._clearFinImg()">×</button></div>`:''}</div></div>`;

  const modal = showModal(record?'编辑收支记录':'新增收支记录', contentHtml + `<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>`);

  function updateCats() {
    const type = modal.getEl('#fType').value;
    const sel = modal.getEl('#fCategory');
    sel.innerHTML = FINANCE_CATEGORIES[type].map(c => `<option value="${c}" ${record&&record.category===c?'selected':''}>${c}</option>`).join('');
  }
  updateCats();
  modal.getEl('#fType').addEventListener('change', updateCats);

  modal.getEl('#finImgUpload').onclick = () => modal.getEl('#finImgInput').click();
  modal.getEl('#finImgInput').onchange = function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        finImgData = e.target.result;
        modal.getEl('#finImgPreview').innerHTML = `<div class="img-preview-item"><img src="${finImgData}"><button class="img-remove" onclick="event.stopPropagation();window._clearFinImg()">×</button></div>`;
        window._getFinImg = () => finImgData;
      };
      reader.readAsDataURL(file);
    }
  };
  window._clearFinImg = () => { finImgData = ''; modal.getEl('#finImgPreview').innerHTML = ''; window._getFinImg = () => ''; };
  window._getFinImg = () => finImgData;

  modal.getEl('.cancel-btn').onclick = () => { window._clearFinImg = null; window._getFinImg = null; modal.close(); };
  modal.getEl('.save-btn').onclick = () => {
    const amount = parseFloat(modal.getEl('#fAmount').value);
    if (!amount || amount <= 0) { showToast('请输入有效金额', 'warning'); return; }
    finImgData = window._getFinImg ? window._getFinImg() : '';
    const data = {
      id: record ? record.id : uid(),
      type: modal.getEl('#fType').value,
      category: modal.getEl('#fCategory').value,
      amount, date: modal.getEl('#fDate').value,
      scene: modal.getEl('#fScene').value.trim(),
      note: modal.getEl('#fNote').value.trim(),
      image: finImgData,
      createdAt: record ? record.createdAt : getNow()
    };
    if (record) { appData.finance[appData.finance.findIndex(f => f.id === editId)] = data; }
    else { appData.finance.unshift(data); }
    saveAll(); modal.close(); renderFn();
    showToast('收支记录已保存', 'success');
    if (data.type === '支出' && amount >= 1000) showToast(`大额支出 ¥${amount.toLocaleString()}，记得合理消费哦～`, 'warning', '💸');
    if (data.type === '收入' && amount >= 5000) showToast(`收入 ¥${amount.toLocaleString()}！继续加油 💪`, 'success', '🎉');
    window._clearFinImg = null; window._getFinImg = null;
  };
}

export function deleteFinance(id, appData, saveAll, renderFn) {
  showConfirm('删除记录', '确定要删除这条收支记录吗？', () => {
    appData.finance = appData.finance.filter(f => f.id !== id);
    saveAll(); renderFn(); showToast('记录已删除', 'info');
  });
}
