import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, FINANCE_CATEGORIES } from '../utils.js';
import { showModal, showConfirm, showToast, createCustomSelect } from '../ui-framework.js';
import { iconHTML } from '../icons.js';

let _finChartState = { records: [] };

export function toggleFinanceCharts() {
  const section = document.getElementById('finChartSection');
  if (!section) return;
  if (_finChartState.records.length) {
    renderFinanceCharts(_finChartState.records);
  }
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const categoryIcons = {
  '餐饮': 'utensils',
  '交通': 'car',
  '购物': 'shopping-cart',
  '娱乐': 'smile-icon',
  '居住': 'home',
  '医疗': 'stethoscope',
  '教育': 'graduation-cap',
  '通讯': 'phone-call',
  '运动': 'dumbbell',
  '旅行': 'plane',
  '工资': 'briefcase',
  '奖金': 'gift',
  '投资': 'trending-up',
  '兼职': 'briefcase',
  '其他收入': 'wallet',
  '其他支出': 'file-text',
};

function getCategoryIcon(category) {
  return categoryIcons[category] || 'wallet';
}

const categoryColors = {
  '餐饮': 'orange',
  '交通': 'blue',
  '购物': 'pink',
  '娱乐': 'purple',
  '居住': 'green',
  '医疗': 'red',
  '教育': 'purple',
  '通讯': 'blue',
  '运动': 'green',
  '旅行': 'orange',
  '工资': 'green',
  '奖金': 'orange',
  '投资': 'blue',
  '兼职': 'purple',
  '其他收入': 'green',
  '其他支出': 'red',
};

function getCategoryColor(category) {
  return categoryColors[category] || 'purple';
}

export function renderFinance(container, appData, saveAll, currentMonth) {
  const monthFilter = currentMonth;
  let records = appData.finance.filter(f => !f.deleted && monthMatch(f.date, monthFilter));
  records.sort((a, b) => (b.date||'').localeCompare(a.date||'') || (b.createdAt||'').localeCompare(a.createdAt||''));
  const incomeTotal = records.filter(f => f.type === '收入').reduce((s, f) => s + (f.amount||0), 0);
  const expenseTotal = records.filter(f => f.type === '支出').reduce((s, f) => s + (f.amount||0), 0);
  const net = incomeTotal - expenseTotal;
  const recordCount = records.length;
  
  _finChartState.records = records;

  const renderFn = () => renderFinance(container, appData, saveAll, monthFilter);

  container.innerHTML = `
    <div class="finance-page-header">
      <div class="finance-title">账本清单</div>
      <div class="finance-subtitle">每一笔收支都值得被记录 · 共 ${recordCount} 条</div>
    </div>
    <div class="finance-top-bar">
      <div class="finance-top-info">
        <div class="finance-top-month">
          ${iconHTML('calendar', { size: 16, color: 'var(--text-secondary)' })}
          <div id="finMonthFilter" class="finance-top-select"></div>
        </div>
        <div class="finance-top-stats">
          <div class="finance-top-stat">
            <span class="finance-top-stat-label">收入</span>
            <span class="finance-top-stat-value income">¥${incomeTotal.toLocaleString()}</span>
          </div>
          <div class="finance-top-divider"></div>
          <div class="finance-top-stat">
            <span class="finance-top-stat-label">支出</span>
            <span class="finance-top-stat-value expense">¥${expenseTotal.toLocaleString()}</span>
          </div>
          <div class="finance-top-divider"></div>
          <div class="finance-top-stat">
            <span class="finance-top-stat-label">结余</span>
            <span class="finance-top-stat-value ${net>=0?'income':'expense'}">${net>=0?'+':''}¥${net.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <button class="btn btn-primary finance-add-btn" onclick="window._openFinanceModal()">
        ${iconHTML('plus', { size: 18 })} 记一笔
      </button>
    </div>

    <div class="finance-section-title" style="margin:20px 0 12px 0">
      <span>收支明细</span>
      <div class="finance-date-filter">
        <button class="btn btn-text btn-sm" id="finChartToggle" onclick="window._toggleFinanceCharts()">
          ${iconHTML('bar-chart', { size: 16 })} 数据分析
        </button>
        <div id="finDayFilter" class="finance-day-select"></div>
      </div>
    </div>
    <div id="finList"></div>

    <div class="finance-chart-section" id="finChartSection">
      <div class="finance-chart-row">
        <div class="chart-card">
          <div class="chart-card-title">
            ${iconHTML('pie-chart', { size: 16, color: 'var(--primary)' })}
            支出分类占比
          </div>
          <div class="chart-wrap"><canvas id="finPieChart" style="max-height:240px"></canvas></div>
        </div>
        <div class="chart-card">
          <div class="chart-card-title">
            ${iconHTML('bar-chart', { size: 16, color: 'var(--primary)' })}
            每日收支趋势
          </div>
          <div class="chart-wrap"><canvas id="finBarChart" style="max-height:240px"></canvas></div>
        </div>
      </div>
    </div>`;

  const monthItems = getMonths().map(m => ({ value: m, label: monthLabel(m) }));
  const monthSelect = createCustomSelect({
    id: 'finMonthSelect',
    value: monthFilter,
    items: monthItems,
    variant: 'text',
    onChange: (val) => { window._filterFinMonth(val); }
  });
  document.getElementById('finMonthFilter').appendChild(monthSelect.el);

  const year = parseInt(monthFilter.slice(0, 4));
  const month = parseInt(monthFilter.slice(5, 7));
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = getToday();
  const todayYear = parseInt(today.slice(0, 4));
  const todayMonth = parseInt(today.slice(5, 7));
  const todayDay = parseInt(today.slice(8, 10));
  let maxDay = daysInMonth;
  if (year === todayYear && month === todayMonth) {
    maxDay = todayDay;
  } else if (year > todayYear || (year === todayYear && month > todayMonth)) {
    maxDay = 0;
  }
  const dayItems = [{ value: '', label: '全部' }];
  for (let d = 1; d <= maxDay; d++) {
    const dayStr = d.toString().padStart(2, '0');
    const fullDate = `${monthFilter}-${dayStr}`;
    dayItems.push({ value: fullDate, label: `${d}号` });
  }
  const daySelect = createCustomSelect({
    id: 'finDaySelect',
    value: '',
    items: dayItems,
    variant: 'minimal',
    align: 'right',
    onChange: (val) => {
      let filtered = records;
      if (val) filtered = records.filter(r => r.date === val);
      renderFinanceList(filtered, appData, saveAll, renderFn);
    }
  });
  document.getElementById('finDayFilter').appendChild(daySelect.el);
  
  renderFinanceList(records, appData, saveAll, renderFn);
  // 数据分析图表默认展示，页面渲染后直接绘制
  if (records.length) renderFinanceCharts(records);
}

function generateFinanceSummary(income, expense, net, records) {
  if (!records.length) return '本月暂无收支记录';
  const rate = income > 0 ? Math.round(expense / income * 100) : 0;
  let advice = '';
  if (rate < 50) advice = '储蓄率优秀，继续保持理性消费的好习惯！';
  else if (rate < 80) advice = '支出比例适中，可以适当关注非必要消费。';
  else if (rate < 100) advice = '本月支出偏高，建议审视消费结构，合理规划。';
  else advice = '本月入不敷出，需要特别注意消费习惯哦。';
  return `收支比 ${rate}%，净${net>=0?'结余':'超支'} ¥${Math.abs(net).toLocaleString()}。${advice}`;
}

function renderFinanceList(records, appData, saveAll, renderFn) {
  const list = document.getElementById('finList');
  if (!list) return;
  if (!records.length) { 
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${iconHTML('wallet', { size: 48 })}</div>
        <div class="empty-state-text">本月暂无收支记录</div>
        <div class="empty-state-hint">点击上方"记一笔"开始记录</div>
      </div>`; 
    return; 
  }
  
  const groups = {};
  records.forEach(r => {
    if (!groups[r.date]) groups[r.date] = [];
    groups[r.date].push(r);
  });
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));
  
  list.innerHTML = dates.map(date => {
    const dayRecords = groups[date];
    const dayLabel = date === getToday() ? '今天' : date;
    
    return `
      <div class="finance-day-group">
        <div class="finance-day-header">
          <span class="finance-day-date">${dayLabel}（共${dayRecords.length}笔）</span>
        </div>
        <div class="finance-day-records">
          ${dayRecords.map(f => {
            const isIncome = f.type === '收入';
            const color = getCategoryColor(f.category);
            const icon = getCategoryIcon(f.category);
            return `
            <div class="finance-record-swipe" data-id="${f.id}">
              <div class="finance-record-actions">
                <div class="finance-record-edit-btn" data-edit-id="${f.id}">
                  ${iconHTML('edit', { color: '#fff', size: 20 })}
                </div>
                <div class="finance-record-delete-btn" data-delete-id="${f.id}">
                  ${iconHTML('trash', { color: '#fff', size: 20 })}
                </div>
              </div>
              <div class="finance-record-card" data-card-id="${f.id}">
                <div class="finance-record-icon ${color}">
                  ${iconHTML(icon, { color: '#fff', size: 20 })}
                </div>
                <div class="finance-record-info">
                  <div class="finance-record-title">
                    ${escHtml(f.scene || f.category)}
                    <span class="tag ${isIncome?'tag-income':'tag-expense'}">${escHtml(f.category)}</span>
                  </div>
                  ${f.note ? `<div class="finance-record-meta"><span class="finance-record-meta-item">${iconHTML('file-text', { size: 12 })} ${escHtml(f.note)}</span></div>` : ''}
                </div>
                <div class="finance-record-amount ${isIncome?'income':'expense'}">
                  ${isIncome ? '+' : '-'}¥${(f.amount||0).toLocaleString()}
                </div>
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');

  initFinanceSwipe(list, appData, saveAll, renderFn);
}

function initFinanceSwipe(container, appData, saveAll, renderFn) {
  const swipeCards = container.querySelectorAll('.finance-record-swipe');
  let activeCard = null;
  let startX = 0;
  let currentX = 0;
  const THRESHOLD = 144;
  const DRAG_THRESHOLD = 6;

  function closeAll() {
    container.querySelectorAll('.finance-record-card.swiped').forEach(c => {
      c.classList.remove('swiped');
      c.style.transform = '';
    });
    activeCard = null;
  }

  function getCard(target) {
    const swipe = target.closest('.finance-record-swipe');
    if (!swipe) return null;
    return swipe.querySelector('.finance-record-card');
  }

  swipeCards.forEach(swipe => {
    const card = swipe.querySelector('.finance-record-card');
    const editBtn = swipe.querySelector('.finance-record-edit-btn');
    const deleteBtn = swipe.querySelector('.finance-record-delete-btn');
    const id = swipe.dataset.id;

    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAll();
      window._openFinanceModal(id);
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAll();
      deleteFinance(id, appData, saveAll, renderFn);
    });

    let touchDragging = false;
    let mouseDragging = false;
    let preventClick = false;

    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      touchDragging = false;
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      const delta = currentX - startX;

      if (Math.abs(delta) > DRAG_THRESHOLD) {
        touchDragging = true;
        preventClick = true;
      }

      if (touchDragging) {
        if (activeCard && activeCard !== card) {
          activeCard.classList.remove('swiped');
          activeCard.style.transform = '';
        }

        let translateX = delta;
        if (card.classList.contains('swiped')) {
          translateX = -THRESHOLD + delta;
        }

        if (translateX > 0) translateX = 0;
        if (translateX < -THRESHOLD - 20) translateX = -THRESHOLD - 20;

        card.style.transform = `translateX(${translateX}px)`;
      }
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transition = '';
      if (!touchDragging) return;

      const delta = currentX - startX;
      let currentOffset = delta;
      if (card.classList.contains('swiped')) {
        currentOffset = -THRESHOLD + delta;
      }

      if (currentOffset < -THRESHOLD / 3) {
        card.classList.add('swiped');
        card.style.transform = '';
        activeCard = card;
      } else {
        card.classList.remove('swiped');
        card.style.transform = '';
        if (activeCard === card) activeCard = null;
      }
      touchDragging = false;
      setTimeout(() => { preventClick = false; }, 300);
    });

    let mouseStartX = 0;
    let mouseCurrentX = 0;

    card.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      mouseStartX = e.clientX;
      mouseCurrentX = mouseStartX;
      mouseDragging = false;
      card.style.transition = 'none';
      card.style.cursor = 'grabbing';

      const onMove = (ev) => {
        mouseCurrentX = ev.clientX;
        const delta = mouseCurrentX - mouseStartX;
        if (Math.abs(delta) > DRAG_THRESHOLD) {
          mouseDragging = true;
          preventClick = true;
        }

        if (mouseDragging) {
          if (activeCard && activeCard !== card) {
            activeCard.classList.remove('swiped');
            activeCard.style.transform = '';
          }
          let translateX = delta;
          if (card.classList.contains('swiped')) {
            translateX = -THRESHOLD + delta;
          }
          if (translateX > 0) translateX = 0;
          if (translateX < -THRESHOLD - 20) translateX = -THRESHOLD - 20;
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
        let currentOffset = delta;
        if (card.classList.contains('swiped')) {
          currentOffset = -THRESHOLD + delta;
        }
        if (currentOffset < -THRESHOLD / 3) {
          card.classList.add('swiped');
          card.style.transform = '';
          activeCard = card;
        } else {
          card.classList.remove('swiped');
          card.style.transform = '';
          if (activeCard === card) activeCard = null;
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
      } else {
        window._openFinanceModal(id);
      }
    });
  });

  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.finance-record-swipe')) {
      closeAll();
    }
  }, { passive: true });

  document.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.finance-record-swipe')) {
      closeAll();
    }
  });
}

function renderFinanceCharts(records) {
  setTimeout(async () => {
    const Chart = (await import('chart.js/auto')).default;
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
        type: 'doughnut', 
        data: { 
          labels: catLabels, 
          datasets: [{ 
            data: catValues, 
            backgroundColor: ['#3B82F6','#8B5CF6','#F59E0B','#10B981','#EF4444','#06B6D4','#EC4899','#F97316'], 
            borderWidth: 0, 
            hoverOffset: 8 
          }] 
        },
        options: { 
          responsive: true, 
          cutout: '65%',
          plugins: { 
            legend: { 
              position: 'bottom', 
              labels: { 
                font: { size: 11, weight: '500' },
                padding: 12,
                usePointStyle: true,
                pointStyle: 'circle'
              } 
            } 
          } 
        }
      });
    } else if (pieCtx) {
      const c = pieCtx.getContext('2d'); 
      c.font = '14px -apple-system, BlinkMacSystemFont, sans-serif'; 
      c.fillStyle = '#8C8C8C'; 
      c.textAlign = 'center';
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
        type: 'bar', 
        data: {
          labels: days.map(d => d.slice(8) + '日'),
          datasets: [
            { 
              label: '收入', 
              data: days.map(d => dailyMap[d].income), 
              backgroundColor: '#10B981', 
              borderRadius: 6, 
              barThickness: 16 
            },
            { 
              label: '支出', 
              data: days.map(d => dailyMap[d].expense), 
              backgroundColor: '#EF4444', 
              borderRadius: 6, 
              barThickness: 16 
            }
          ]
        },
        options: { 
          responsive: true, 
          plugins: { 
            legend: { 
              position: 'bottom', 
              labels: { 
                font: { size: 11, weight: '500' }, 
                boxWidth: 12,
                padding: 12,
                usePointStyle: true,
                pointStyle: 'circle'
              } 
            } 
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 10 } }
            },
            y: {
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: { font: { size: 10 } }
            }
          }
        }
      });
    }
  }, 300);
}

export function openFinanceModal(editId, appData, saveAll, renderFn) {
  const record = editId ? appData.finance.find(f => f.id === editId) : null;
  openFinanceModalWithDefaults(editId, appData, saveAll, renderFn, null, null);
}

export function openQuickFinanceModal(type, category, appData, saveAll, renderFn) {
  openFinanceModalWithDefaults(null, appData, saveAll, renderFn, type, category);
}

function openFinanceModalWithDefaults(editId, appData, saveAll, renderFn, defaultType, defaultCategory) {
  const record = editId ? appData.finance.find(f => f.id === editId) : null;
  const initType = defaultType || (record ? record.type : '支出');
  const initCategory = defaultCategory || (record ? record.category : FINANCE_CATEGORIES[initType][0]);
  let finImgData = record && record.image ? record.image : '';
  let contentHtml = `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">类型</label>
        <select id="fType">
          <option value="支出" ${initType==='支出'?'selected':''}>支出</option>
          <option value="收入" ${initType==='收入'?'selected':''}>收入</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">金额 *</label>
        <input type="number" id="fAmount" value="${record?record.amount:''}" placeholder="0.00" step="0.01" min="0">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">分类</label>
        <select id="fCategory"></select>
      </div>
      <div class="form-group">
        <label class="form-label">日期</label>
        <input type="date" id="fDate" value="${record?record.date:getToday()}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">消费场景</label>
      <input id="fScene" value="${record?escHtml(record.scene||''):''}" placeholder="描述这笔收支">
    </div>
    <div class="form-group">
      <label class="form-label">备注</label>
      <input id="fNote" value="${record?escHtml(record.note||''):''}" placeholder="备注信息">
    </div>
    <div class="form-group">
      <label class="form-label">图片凭证（可选）</label>
      <div class="img-upload-area" id="finImgUpload">
        ${iconHTML('image', { size: 24 })} 点击上传凭证
      </div>
      <input type="file" id="finImgInput" accept="image/*" style="display:none">
      <div class="img-preview" id="finImgPreview">
        ${finImgData?`<div class="img-preview-item"><img src="${finImgData}"><button class="img-remove" onclick="event.stopPropagation();window._clearFinImg()">×</button></div>`:''}
      </div>
    </div>`;

  const modal = showModal(record?'编辑收支记录':'新增收支记录', contentHtml + `
    <div class="modal-footer">
      <button class="btn btn-ghost cancel-btn">取消</button>
      <button class="btn btn-primary save-btn">保存</button>
    </div>`);

  function updateCats() {
    const type = modal.getEl('#fType').value;
    const sel = modal.getEl('#fCategory');
    sel.innerHTML = FINANCE_CATEGORIES[type].map(c => `<option value="${c}" ${(record&&record.category===c)||(!record&&c===initCategory&&type===initType)?'selected':''}>${c}</option>`).join('');
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
      createdAt: record ? record.createdAt : getNow(),
      updatedAt: getNow()
    };
    if (record) { appData.finance[appData.finance.findIndex(f => f.id === editId)] = data; }
    else { appData.finance.unshift(data); }
    saveAll(); modal.close(); renderFn();
    showToast('收支记录已保存', 'success');
    if (data.type === '支出' && amount >= 1000) showToast(`大额支出 ¥${amount.toLocaleString()}，记得合理消费哦～`, 'warning', 'alert-circle');
    if (data.type === '收入' && amount >= 5000) showToast(`收入 ¥${amount.toLocaleString()}！继续加油`, 'success', 'trophy');
    window._clearFinImg = null; window._getFinImg = null;
  };
}

export function deleteFinance(id, appData, saveAll, renderFn) {
  showConfirm('删除记录', '确定要删除这条收支记录吗？', () => {
    const idx = appData.finance.findIndex(f => f.id === id);
    if (idx >= 0) {
      appData.finance[idx].deleted = true;
      appData.finance[idx].updatedAt = new Date().toISOString();
    }
    saveAll(); renderFn(); showToast('记录已删除', 'info');
  });
}
