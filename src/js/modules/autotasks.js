// ========================================
// 自动化定时任务模块
// ========================================
import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, getStatusTag, getEncourage } from '../utils.js';
import { showModal, showConfirm, showToast, showEncourage, burstParticles } from '../ui-framework.js';

export function renderAutoTasks(container, appData, saveAll, currentMonth) {
  const tasks = [...appData.autotasks];
  const monthFilter = currentMonth;

  container.innerHTML = `
    <div class="page-title">定时任务</div>
    <div class="page-subtitle">自动化日常事务管控 · 共 ${tasks.length} 项</div>
    <div class="filter-bar">
      <select id="taskStatusFilter">
        <option value="全部">全部状态</option><option value="未完成">未完成</option><option value="已完成">已完成</option><option value="即将开始">即将开始</option></select>
      <select id="taskMonthFilter"><option value="">全部时间</option>${getMonths().map(m => `<option value="${m}" ${m===monthFilter?'selected':''}>${monthLabel(m)}</option>`).join('')}</select>
    </div>
    <div class="stat-grid" style="margin-bottom:16px">
      <div class="stat-card"><div class="stat-card-label">本月打卡次数</div><div class="stat-card-value">${tasks.reduce((s,t) => s + (t.completedDates||[]).filter(d => monthMatch(d, monthFilter)).length, 0)}</div></div>
      <div class="stat-card"><div class="stat-card-label">任务总数 / 完成率</div><div class="stat-card-value">${tasks.length} / ${tasks.length?Math.round(tasks.filter(t => t.status==='已完成').length/tasks.length*100):0}%</div></div>
    </div>
    <div class="list" id="taskList"></div>`;

  document.getElementById('taskStatusFilter').onchange = function() { container.dataset.taskFilter = this.value; window._renderCurrentView(); };
  document.getElementById('taskMonthFilter').onchange = function() { window._filterTasksMonth(this.value); };
  renderTaskList(tasks, appData, saveAll, container, currentMonth);
}

function getTaskScheduleLabel(t) {
  switch (t.scheduleType) {
    case 'daily': return `每天 ${t.scheduleTime}`;
    case 'weekday': return `工作日 ${t.scheduleTime}`;
    case 'interval': return `每${t.scheduleDays}天 ${t.scheduleTime}`;
    case 'monthly': return `每月${t.scheduleDate}日 ${t.scheduleTime}`;
    case 'once': return `一次性 · ${t.scheduleDate} ${t.scheduleTime}`;
    default: return t.scheduleTime;
  }
}

function renderTaskList(tasks, appData, saveAll, container, currentMonth) {
  const list = document.getElementById('taskList');
  if (!list) return;
  const filterStatus = container.dataset.taskFilter || '全部';
  let filtered = filterStatus === '全部' ? tasks : tasks.filter(t => t.status === filterStatus);
  if (!filtered.length) { list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⏰</div><div class="empty-state-text">暂无任务</div><div class="empty-state-hint">新增一个定时任务开始自动化管理吧</div></div>`; return; }

  const today = getToday();
  list.innerHTML = filtered.map(t => {
    const doneToday = (t.completedDates || []).includes(today);
    const isRecurring = t.scheduleType !== 'once';
    return `
    <div class="card" style="display:flex;align-items:flex-start;gap:14px">
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
          <span style="font-size:15px;font-weight:600">${escHtml(t.name)}</span>${getStatusTag(doneToday?'已完成':t.status)}
          <span style="font-size:11px;color:var(--text-light)">${isRecurring?'🔄 周期':'📌 一次性'}</span></div>
        ${t.description?`<div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px">${escHtml(t.description)}</div>`:''}
        <div style="font-size:12px;color:var(--text-light);display:flex;gap:12px;flex-wrap:wrap">
          <span>⏰ ${getTaskScheduleLabel(t)}</span>
          <span>本月打卡 ${(t.completedDates||[]).filter(d => monthMatch(d, currentMonth)).length} 次</span></div></div>
      <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0;align-items:center">
        <button class="btn ${doneToday?'btn-primary':'btn-outline'} btn-sm" style="min-width:60px" onclick="window._checkinTask('${t.id}')">${doneToday?'✅ 已打卡':'打卡'}</button>
        <div style="display:flex;gap:4px">
          <button class="btn btn-ghost btn-sm" onclick="window._openAutoTaskModal('${t.id}')">✏️</button>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="window._deleteAutoTask('${t.id}')">🗑</button></div></div></div>`;
  }).join('');
}

export function checkinTask(id, appData, saveAll, renderFn) {
  const task = appData.autotasks.find(t => t.id === id);
  if (!task) return;
  if (!task.completedDates) task.completedDates = [];
  const today = getToday();
  if (task.completedDates.includes(today)) { showToast('今天已经打卡过了～', 'warning'); return; }
  task.completedDates.push(today);
  task.status = '已完成';
  saveAll(); renderFn();
  burstParticles(window.innerWidth/2, window.innerHeight*0.4, 12);
  showEncourage('done');
}

export function openAutoTaskModal(editId, appData, saveAll, renderFn) {
  const task = editId ? appData.autotasks.find(t => t.id === editId) : null;
  const content = `
    <div class="form-group"><label class="form-label">任务名称 *</label><input id="atName" value="${task?escHtml(task.name):''}" placeholder="输入任务名称"></div>
    <div class="form-group"><label class="form-label">任务描述</label><input id="atDesc" value="${task?escHtml(task.description||''):''}" placeholder="描述这个任务"></div>
    <div class="form-row"><div class="form-group"><label class="form-label">执行周期</label><select id="atScheduleType"><option value="daily" ${task&&task.scheduleType==='daily'?'selected':''}>每日</option><option value="weekday" ${task&&task.scheduleType==='weekday'?'selected':''}>工作日</option><option value="interval" ${task&&task.scheduleType==='interval'?'selected':''}>固定间隔天数</option><option value="monthly" ${task&&task.scheduleType==='monthly'?'selected':''}>每月固定日期</option><option value="once" ${task&&task.scheduleType==='once'?'selected':''}>一次性定时</option></select></div>
    <div class="form-group"><label class="form-label">提醒时间</label><input type="time" id="atTime" value="${task?task.scheduleTime:'09:00'}"></div></div>
    <div id="scheduleExtraFields"></div>`;

  const modal = showModal(task?'编辑定时任务':'新增定时任务', content + `<div class="modal-footer"><button class="btn btn-ghost cancel-btn">取消</button><button class="btn btn-primary save-btn">保存</button></div>`);

  function updateExtra() {
    const type = modal.getEl('#atScheduleType').value;
    const div = modal.getEl('#scheduleExtraFields');
    if (type === 'interval') div.innerHTML = `<div class="form-group"><label class="form-label">间隔天数</label><input type="number" id="atDays" value="${task?task.scheduleDays||'3':'3'}" min="1" max="365"></div>`;
    else if (type === 'monthly') div.innerHTML = `<div class="form-group"><label class="form-label">每月几号</label><input type="number" id="atDate" value="${task?task.scheduleDate||'1':'1'}" min="1" max="28"></div>`;
    else if (type === 'once') div.innerHTML = `<div class="form-group"><label class="form-label">执行日期</label><input type="date" id="atOnceDate" value="${task?task.scheduleDate||getToday():getToday()}"></div>`;
    else div.innerHTML = '';
  }
  updateExtra();
  modal.getEl('#atScheduleType').addEventListener('change', updateExtra);

  modal.getEl('.cancel-btn').onclick = modal.close;
  modal.getEl('.save-btn').onclick = () => {
    const name = modal.getEl('#atName').value.trim();
    if (!name) { showToast('请输入任务名称', 'warning'); return; }
    const stype = modal.getEl('#atScheduleType').value;
    const data = {
      id: task ? task.id : uid(), name,
      description: modal.getEl('#atDesc').value.trim(),
      scheduleType: stype,
      scheduleTime: modal.getEl('#atTime').value,
      scheduleDays: stype==='interval' ? (modal.getEl('#atDays')?.value || '3') : '',
      scheduleDate: stype==='monthly' ? (modal.getEl('#atDate')?.value || '1') : stype==='once' ? (modal.getEl('#atOnceDate')?.value || getToday()) : '',
      status: task ? task.status : '未完成',
      completedDates: task ? (task.completedDates || []) : [],
      createdAt: task ? task.createdAt : getNow()
    };
    if (task) { appData.autotasks[appData.autotasks.findIndex(t => t.id === editId)] = data; }
    else { appData.autotasks.push(data); }
    saveAll(); modal.close(); renderFn();
    showToast('定时任务已保存', 'success');
  };
}

export function deleteAutoTask(id, appData, saveAll, renderFn) {
  showConfirm('删除任务', '确定要删除这个定时任务吗？', () => {
    appData.autotasks = appData.autotasks.filter(t => t.id !== id);
    saveAll(); renderFn(); showToast('任务已删除', 'info');
  });
}

// ── Task scheduler check ──
export function checkDueTasks(appData, appSettings, saveAll, renderFn, showToastFn, LocalNotifications) {
  if (!appSettings.notifications) return [];
  const now = new Date();
  const today = getToday();
  const currentHour = String(now.getHours()).padStart(2, '0');
  const currentMinute = String(now.getMinutes()).padStart(2, '0');
  const currentTime = currentHour + ':' + currentMinute;
  const weekday = now.getDay();
  const dueTasks = [];

  appData.autotasks.forEach(task => {
    if (!task.completedDates) task.completedDates = [];
    if (task.completedDates.includes(today)) return;
    let due = false;
    switch (task.scheduleType) {
      case 'daily': due = task.scheduleTime === currentTime; break;
      case 'weekday': due = weekday >= 1 && weekday <= 5 && task.scheduleTime === currentTime; break;
      case 'interval': {
        const days = parseInt(task.scheduleDays) || 3;
        const lastDone = task.completedDates.length ? task.completedDates[task.completedDates.length - 1] : null;
        due = !lastDone ? task.scheduleTime === currentTime : (Math.floor((now - new Date(lastDone)) / (1000*60*60*24)) >= days && task.scheduleTime === currentTime);
        break;
      }
      case 'monthly':
        due = now.getDate() === (parseInt(task.scheduleDate) || 1) && task.scheduleTime === currentTime;
        break;
      case 'once':
        due = task.scheduleDate === today && task.scheduleTime === currentTime;
        break;
    }
    if (due && task.status !== '已完成') {
      task.status = '即将开始';
      dueTasks.push(task);
    }
  });

  if (dueTasks.length) {
    saveAll();
    if (renderFn) renderFn();
    dueTasks.forEach(t => {
      if (showToastFn) showToastFn(`⏰ 任务提醒：${t.name}`, 'warning', '🔔');
    });
    // Send native system notification via Capacitor (works in background / lock screen)
    if (LocalNotifications) {
      dueTasks.forEach(async (t, i) => {
        try {
          await LocalNotifications.schedule({
            notifications: [{
              title: '⏰ 定时任务提醒',
              body: `「${t.name}」该处理啦！`,
              id: (parseInt(t.id.replace(/\D/g, '').slice(0, 5)) || Date.now() % 100000) + i,
              schedule: { at: new Date(Date.now() + 1000) },
              sound: 'beep.wav',
              smallIcon: 'ic_stat_notification',
              iconColor: '#9BB5A3',
              channelId: 'task-reminders',
              channelName: '定时任务提醒',
              importance: 4, // HIGH — shows as heads-up notification
            }]
          });
        } catch (e) {
          console.warn('LocalNotification schedule error:', e);
        }
      });
    }
  }
  return dueTasks;
}
