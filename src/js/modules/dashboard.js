// ========================================
// 数据看板模块
// ========================================
import { getToday, monthMatch, monthLabel } from '../utils.js';

export async function renderDashboard(container, appData) {
  const plans = appData.plans;
  const tasks = appData.autotasks;
  const learning = appData.learning;
  const habits = appData.habits;
  const finance = appData.finance;
  const month = getToday().slice(0, 7);

  const planTotal = plans.length;
  const planDone = plans.filter(p => p.status === '已完成').length;
  const planRate = planTotal ? Math.round(planDone / planTotal * 100) : 0;

  const taskMonth = tasks.filter(t => (t.completedDates || []).some(d => monthMatch(d, month)));
  const taskDoneThisMonth = taskMonth.length;
  const taskTotal = tasks.length;
  const taskAllCompletions = tasks.reduce((s, t) => s + (t.completedDates || []).filter(d => monthMatch(d, month)).length, 0);

  const learnMonth = learning.filter(l => monthMatch(l.studyTime, month)).length;
  const posHabits = habits.filter(h => h.type === '正向');
  const negHabits = habits.filter(h => h.type === '负面');
  const avgPosRating = posHabits.length ? (posHabits.reduce((s, h) => s + (h.rating || 0), 0) / posHabits.length).toFixed(1) : '--';
  const avgNegRating = negHabits.length ? (negHabits.reduce((s, h) => s + (h.rating || 0), 0) / negHabits.length).toFixed(1) : '--';

  const finMonth = finance.filter(f => monthMatch(f.date, month));
  const incomeMonth = finMonth.filter(f => f.type === '收入').reduce((s, f) => s + (f.amount || 0), 0);
  const expenseMonth = finMonth.filter(f => f.type === '支出').reduce((s, f) => s + (f.amount || 0), 0);
  const netMonth = incomeMonth - expenseMonth;

  container.innerHTML = `
    <div class="page-title">数据看板</div>
    <div class="page-subtitle">${monthLabel(month)} · 个人状态一览</div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-card-label">📋 计划完成率</div><div class="stat-card-value">${planRate}%</div><div class="progress-bar"><div class="progress-bar-fill" style="width:${planRate}%"></div></div><div class="stat-card-sub">${planDone}/${planTotal} 已完成</div></div>
      <div class="stat-card"><div class="stat-card-label">⏰ 本月打卡</div><div class="stat-card-value">${taskAllCompletions}</div><div class="stat-card-sub">${taskDoneThisMonth}/${taskTotal} 项有打卡记录</div></div>
      <div class="stat-card"><div class="stat-card-label">📖 本月学习</div><div class="stat-card-value">${learnMonth}</div><div class="stat-card-sub">本月学习记录次数</div></div>
      <div class="stat-card"><div class="stat-card-label">🌱 正向习惯均分</div><div class="stat-card-value">${avgPosRating}</div><div class="stat-card-sub">共 ${posHabits.length} 项正向习惯</div></div>
      <div class="stat-card"><div class="stat-card-label">💰 本月净收支</div><div class="stat-card-value" style="color:${netMonth>=0?'var(--primary-deep)':'var(--accent-deep)'}">${netMonth>=0?'+':''}¥${netMonth.toLocaleString()}</div><div class="stat-card-sub">收入 ¥${incomeMonth.toLocaleString()} · 支出 ¥${expenseMonth.toLocaleString()}</div></div>
      <div class="stat-card"><div class="stat-card-label">⚡ 负面习惯均分</div><div class="stat-card-value">${avgNegRating}</div><div class="stat-card-sub">共 ${negHabits.length} 项负面习惯（越低越好）</div></div></div>

    <div class="dashboard-grid">
      <div class="dash-module-card" onclick="window._navigateTo('plans')"><div class="module-icon">📋</div><div class="module-name">计划清单</div><div class="module-stat">${planTotal} 条计划 · ${planRate}% 完成率</div><div class="progress-bar" style="margin-top:10px"><div class="progress-bar-fill" style="width:${planRate}%"></div></div></div>
      <div class="dash-module-card" onclick="window._navigateTo('autotasks')"><div class="module-icon">⏰</div><div class="module-name">定时任务</div><div class="module-stat">${taskTotal} 项任务 · 本月 ${taskAllCompletions} 次打卡</div></div>
      <div class="dash-module-card" onclick="window._navigateTo('learning')"><div class="module-icon">📖</div><div class="module-name">学习记录</div><div class="module-stat">${learning.length} 条记录 · 本月 ${learnMonth} 次</div></div>
      <div class="dash-module-card" onclick="window._navigateTo('habits')"><div class="module-icon">🌱</div><div class="module-name">习惯追踪</div><div class="module-stat">正向 ${posHabits.length} · 负面 ${negHabits.length}</div></div>
      <div class="dash-module-card" onclick="window._navigateTo('finance')"><div class="module-icon">💰</div><div class="module-name">记账账本</div><div class="module-stat">本月净收支 ¥${netMonth.toLocaleString()}</div></div>
      <div class="dash-module-card" onclick="window._navigateTo('settings')"><div class="module-icon">⚙️</div><div class="module-name">设置中心</div><div class="module-stat">提醒 · 主题 · 同步 · 备份</div></div></div>

    <div style="margin-top:24px"><div class="section-title">月度收支概览</div><div class="chart-row"><div class="chart-card"><div class="chart-wrap"><canvas id="dashFinBar"></canvas></div></div><div class="chart-card"><div class="chart-wrap"><canvas id="dashFinPie"></canvas></div></div></div></div>
    <div style="margin-top:24px;text-align:center"><p style="font-size:13px;color:var(--text-light)">${planRate>=80?'🌟 计划执行得非常棒，继续保持！':planRate>=50?'🌿 计划稳步推进中，加油！':planRate>0?'🌱 还有提升空间，慢慢来～':'📝 新的一年，从制定计划开始吧！'}</p></div>`;

  // Render charts
  setTimeout(async () => {
    const Chart = (await import('chart.js/auto')).default;
    if (window._dashChartInstances) { Object.values(window._dashChartInstances).forEach(c => c.destroy()); }
    window._dashChartInstances = {};

    const cats = {}; finMonth.filter(f => f.type === '支出').forEach(f => { cats[f.category] = (cats[f.category] || 0) + (f.amount || 0); });
    const catLabels = Object.keys(cats); const catValues = Object.values(cats);

    const barCtx = document.getElementById('dashFinBar');
    if (barCtx) {
      window._dashChartInstances.bar = new Chart(barCtx, {
        type: 'bar', data: { labels: ['收入', '支出', '净收支'], datasets: [{ label: '金额(元)', data: [incomeMonth, expenseMonth, netMonth], backgroundColor: ['#9BB5A3', '#D4A9A6', netMonth>=0?'#9BB5A3':'#D4A9A6'], borderRadius: 8 }] },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }

    const pieCtx = document.getElementById('dashFinPie');
    if (pieCtx && catLabels.length) {
      window._dashChartInstances.pie = new Chart(pieCtx, {
        type: 'doughnut', data: { labels: catLabels, datasets: [{ data: catValues, backgroundColor: ['#9BB5A3', '#D4A9A6', '#8BA5B5', '#E8C8A0', '#C9A0A0', '#B5C9A0'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
    }
  }, 200);
}
