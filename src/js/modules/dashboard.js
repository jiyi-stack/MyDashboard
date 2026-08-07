import { getToday, monthMatch, monthLabel } from '../utils.js';
import { iconHTML } from '../icons.js';

export async function renderDashboard(container, appData) {
  const plans = appData.plans.filter(p => !p.deleted);
  const tasks = appData.autotasks.filter(t => !t.deleted);
  const learning = appData.learning.filter(l => !l.deleted);
  const habits = appData.habits.filter(h => !h.deleted);
  const finance = appData.finance.filter(f => !f.deleted);
  const month = getToday().slice(0, 7);
  const today = new Date();
  const hour = today.getHours();
  
  let greeting = '早上好';
  if (hour >= 12 && hour < 14) greeting = '中午好';
  else if (hour >= 14 && hour < 18) greeting = '下午好';
  else if (hour >= 18 && hour < 22) greeting = '晚上好';
  else if (hour >= 22 || hour < 5) greeting = '夜深了';

  const planTotal = plans.length;
  const planDone = plans.filter(p => p.status === '已完成').length;
  const planDoing = plans.filter(p => p.status === '进行中').length;
  const planTodo = plans.filter(p => p.status === '待办').length;
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

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;

  container.innerHTML = `
    <div class="welcome-section">
      <div class="welcome-info">
        <div class="welcome-greeting">${greeting} ${iconHTML('sparkles', { size: 18, color: '#F59E0B' })}</div>
        <div class="welcome-subtitle">今天也要元气满满地生活哦～</div>
        <div class="welcome-date">${dateStr}</div>
      </div>
      <div class="welcome-illustration">
        <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="100" y="10" width="90" height="70" rx="10" fill="url(#grad1)" opacity="0.9"/>
          <rect x="108" y="20" width="30" height="4" rx="2" fill="rgba(255,255,255,0.8)"/>
          <rect x="108" y="30" width="50" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
          <rect x="108" y="40" width="40" height="4" rx="2" fill="rgba(255,255,255,0.5)"/>
          <rect x="108" y="50" width="55" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
          <rect x="108" y="60" width="35" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
          <circle cx="170" cy="35" r="18" fill="rgba(255,255,255,0.25)"/>
          <path d="M160 35 L168 43 L180 31" stroke="rgba(255,255,255,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <rect x="60" y="0" width="35" height="50" rx="6" fill="#E0E7FF" opacity="0.6"/>
          <rect x="68" y="8" width="22" height="3" rx="1.5" fill="#A5B4FC"/>
          <rect x="68" y="16" width="18" height="3" rx="1.5" fill="#C7D2FE"/>
          <rect x="68" y="24" width="20" height="3" rx="1.5" fill="#C7D2FE"/>
          <rect x="68" y="32" width="16" height="3" rx="1.5" fill="#E0E7FF"/>
          <circle cx="78" cy="40" r="4" fill="#818CF8"/>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <div class="stats-banner">
      <div class="stat-banner-item blue">
        <div class="stat-banner-icon">
          ${iconHTML('clipboard-list', { color: '#fff', size: 22 })}
        </div>
        <div class="stat-banner-value">${planTodo}</div>
        <div class="stat-banner-label">待办</div>
        <div class="stat-banner-sub">待处理事项</div>
      </div>
      <div class="stat-banner-item purple">
        <div class="stat-banner-icon">
          ${iconHTML('clock', { color: '#fff', size: 22 })}
        </div>
        <div class="stat-banner-value">${planDoing}</div>
        <div class="stat-banner-label">进行中</div>
        <div class="stat-banner-sub">进行中的任务</div>
      </div>
      <div class="stat-banner-item green">
        <div class="stat-banner-icon">
          ${iconHTML('check-circle', { color: '#fff', size: 22 })}
        </div>
        <div class="stat-banner-value">${planDone}</div>
        <div class="stat-banner-label">已完成</div>
        <div class="stat-banner-sub">已完成的任务</div>
      </div>
      <div class="stat-banner-item orange">
        <div class="stat-banner-icon">
          ${iconHTML('wallet', { color: '#fff', size: 22 })}
        </div>
        <div class="stat-banner-value">¥${netMonth.toLocaleString()}</div>
        <div class="stat-banner-label">金额</div>
        <div class="stat-banner-sub">账户净收入</div>
      </div>
    </div>

    <div class="section-title">数据概览</div>
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#8B5CF6">${iconHTML('clipboard-list', { size: 18 })}</span>
          计划完成率
        </div>
        <div class="stat-card-value">${planRate}%</div>
        <div class="progress-bar" style="margin-top:12px">
          <div class="progress-bar-fill" style="width:${planRate}%"></div>
        </div>
        <div class="stat-card-sub">${planDone}/${planTotal} 已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#F59E0B">${iconHTML('target', { size: 18 })}</span>
          本月打卡
        </div>
        <div class="stat-card-value">${taskAllCompletions}</div>
        <div class="stat-card-sub">${taskDoneThisMonth}/${taskTotal} 习惯打卡记录</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#3B82F6">${iconHTML('book-open', { size: 18 })}</span>
          本月学习
        </div>
        <div class="stat-card-value">${learnMonth}</div>
        <div class="stat-card-sub">本月学习记录次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#10B981">${iconHTML('sprout', { size: 18 })}</span>
          正向习惯得分
        </div>
        <div class="stat-card-value">${avgPosRating}</div>
        <div class="stat-card-sub">共 ${posHabits.length} 项正向习惯</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#10B981">${iconHTML('wallet', { size: 18 })}</span>
          本月净收支
        </div>
        <div class="stat-card-value" style="color:${netMonth>=0?'var(--success-deep)':'var(--danger-deep)'}">${netMonth>=0?'+':''}¥${netMonth.toLocaleString()}</div>
        <div class="stat-card-sub">收入 ¥${incomeMonth.toLocaleString()} · 支出 ¥${expenseMonth.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">
          <span style="color:#F59E0B">${iconHTML('zap', { size: 18 })}</span>
          负面习惯扣分
        </div>
        <div class="stat-card-value">${avgNegRating}</div>
        <div class="stat-card-sub">共 ${negHabits.length} 项负面习惯（越低越好）</div>
      </div>
    </div>

    <div class="section-title">月度收支概览</div>
    <div class="chart-row">
      <div class="chart-card">
        <div class="chart-card-title">收支情况（单位：元）</div>
        <div class="chart-wrap"><canvas id="dashFinBar"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-card-title">收支占比（单位：元）</div>
        <div class="chart-wrap"><canvas id="dashFinPie"></canvas></div>
      </div>
    </div>
    <div style="margin-top:8px;text-align:center">
      <p style="font-size:13px;color:var(--text-secondary);font-weight:500;display:flex;align-items:center;justify-content:center;gap:6px">
        ${planRate>=80?`${iconHTML('trophy', { size: 14, color: '#F59E0B' })} 计划执行得非常棒，继续保持！`:planRate>=50?`${iconHTML('trending-up', { size: 14, color: '#10B981' })} 计划稳步推进中，加油！`:planRate>0?`${iconHTML('sprout', { size: 14, color: '#10B981' })} 还有提升空间，慢慢来～`:`${iconHTML('clipboard-list', { size: 14, color: '#8B5CF6' })} 新的一天，从制定计划开始吧！`}
      </p>
    </div>`;

  setTimeout(async () => {
    const Chart = (await import('chart.js/auto')).default;
    if (window._dashChartInstances) { Object.values(window._dashChartInstances).forEach(c => c.destroy()); }
    window._dashChartInstances = {};

    const cats = {}; finMonth.filter(f => f.type === '支出').forEach(f => { cats[f.category] = (cats[f.category] || 0) + (f.amount || 0); });
    const catLabels = Object.keys(cats); const catValues = Object.values(cats);

    const barCtx = document.getElementById('dashFinBar');
    if (barCtx) {
      window._dashChartInstances.bar = new Chart(barCtx, {
        type: 'bar', data: {
          labels: ['收入', '支出', '净收支'],
          datasets: [{
            label: '金额(元)',
            data: [incomeMonth, expenseMonth, netMonth],
            backgroundColor: ['#10B981', '#EF4444', netMonth>=0?'#3B82F6':'#F59E0B'],
            borderRadius: 8,
            barThickness: 36
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(15,23,42,0.04)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const pieCtx = document.getElementById('dashFinPie');
    if (pieCtx && catLabels.length) {
      window._dashChartInstances.pie = new Chart(pieCtx, {
        type: 'doughnut', data: {
          labels: catLabels,
          datasets: [{
            data: catValues,
            backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#0EA5E9', '#FBBF24'],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } }
            }
          }
        }
      });
    }
  }, 200);
}
