import { uid, fmtDate, getToday, getNow, monthMatch, escHtml, getMonths, monthLabel, getStatusTag, getEncourage, initSwipeActions } from '../utils.js';
import { showModal, showConfirm, showToast, showEncourage, burstParticles, showTaskReminder, createCustomSelect } from '../ui-framework.js';
import { iconHTML } from '../icons.js';

const taskColors = ['purple', 'green', 'blue', 'orange', 'red', 'pink'];
const taskIcons = ['users', 'briefcase', 'droplets', 'file-text', 'sprout', 'coffee'];

function getTaskColor(idx) {
  return taskColors[idx % taskColors.length];
}

function getTaskIcon(idx) {
  return taskIcons[idx % taskIcons.length];
}

function getRepeatLabel(t) {
  switch (t.scheduleType) {
    case 'daily': return '每天';
    case 'weekday': return '工作日';
    case 'interval': return `每${t.scheduleDays}天`;
    case 'monthly': return `每月${t.scheduleDate}日`;
    case 'once': return '一次性';
    default: return '每天';
  }
}

export function renderAutoTasks(container, appData, saveAll, currentMonth) {
  const tasks = appData.autotasks.filter(t => !t.deleted);
  const monthFilter = currentMonth;
  const today = getToday();
  
  const todayTasks = tasks.filter(t => {
    const doneToday = (t.completedDates || []).includes(today);
    if (doneToday) return false;
    if (t.scheduleType === 'daily') return true;
    if (t.scheduleType === 'weekday') {
      const day = new Date().getDay();
      return day >= 1 && day <= 5;
    }
    if (t.scheduleType === 'once') return t.scheduleDate === today;
    return true;
  }).length;

  const doneThisMonth = tasks.reduce((s, t) => s + (t.completedDates || []).filter(d => monthMatch(d, monthFilter)).length, 0);
  const totalTasks = tasks.length;
  const doneRate = totalTasks ? Math.round(tasks.filter(t => t.status === '已完成').length / totalTasks * 100) : 0;

  container.innerHTML = `
    <div class="task-page-header">
      <div class="task-header-left">
        <div class="task-title">定时任务</div>
        <div class="task-subtitle">自动化管理你的日常任务 · 共 ${totalTasks} 个</div>
      </div>
    </div>

    <div class="task-stats-row">
      <div class="task-stat-card">
        <div class="task-stat-icon primary">
          ${iconHTML('clock', { color: '#fff', size: 24 })}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">今日待办</div>
          <div class="task-stat-value">${todayTasks}</div>
        </div>
      </div>
      <div class="task-stat-card">
        <div class="task-stat-icon success">
          ${iconHTML('check-circle', { color: '#fff', size: 24 })}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">本月完成</div>
          <div class="task-stat-value">${doneThisMonth}</div>
        </div>
      </div>
      <div class="task-stat-card">
        <div class="task-stat-icon warning">
          ${iconHTML('target', { color: '#fff', size: 24 })}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">完成率</div>
          <div class="task-stat-value">${doneRate}%</div>
        </div>
        <div class="task-stat-progress">
          <div class="progress-bar-sm">
            <div class="progress-bar-fill success" style="width:${doneRate}%"></div>
          </div>
        </div>
      </div>
      <div class="task-stat-card">
        <div class="task-stat-icon accent">
          ${iconHTML('list-todo', { color: '#fff', size: 24 })}
        </div>
        <div class="task-stat-info">
          <div class="task-stat-label">任务总数</div>
          <div class="task-stat-value">${totalTasks}</div>
        </div>
      </div>
    </div>

    <div class="task-toolbar">
      <button class="btn btn-outline btn-sm" onclick="window._openAutoTaskModal()">
        ${iconHTML('plus', { size: 16 })} 新增
      </button>
      <div style="flex:1"></div>
      <div class="task-filters">
        <div id="taskStatusFilter"></div>
        <div id="taskMonthFilter"></div>
      </div>
    </div>

    <div id="taskList"></div>`;

  const statusItems = [
    { value: '全部', label: '全部状态' },
    { value: '未完成', label: '未完成' },
    { value: '已完成', label: '已完成' },
    { value: '即将开始', label: '即将开始' },
  ];
  const statusSelect = createCustomSelect({
    id: 'taskStatusSelect',
    value: container.dataset.taskFilter || '全部',
    items: statusItems,
    size: 'sm',
    variant: 'text',
    align: 'right',
    onChange: (val) => { container.dataset.taskFilter = val; window._renderCurrentView(); }
  });
  document.getElementById('taskStatusFilter').appendChild(statusSelect.el);

  const monthItems = [{ value: '', label: '全部时间' }, ...getMonths().map(m => ({ value: m, label: monthLabel(m) }))];
  const monthSelect = createCustomSelect({
    id: 'taskMonthSelect',
    value: monthFilter || '',
    items: monthItems,
    size: 'sm',
    variant: 'text',
    align: 'right',
    onChange: (val) => { window._filterTasksMonth(val); }
  });
  document.getElementById('taskMonthFilter').appendChild(monthSelect.el);

  renderTaskList(tasks, appData, saveAll, container, currentMonth);
}

function renderTaskList(tasks, appData, saveAll, container, currentMonth) {
  const list = document.getElementById('taskList');
  if (!list) return;
  const filterStatus = container.dataset.taskFilter || '全部';
  let filtered = filterStatus === '全部' ? tasks : tasks.filter(t => t.status === filterStatus);
  // 已关闭（enabled=false）的任务排到列表最底部，其余保持原顺序
  filtered = [...filtered].sort((a, b) => (a.enabled === false ? 1 : 0) - (b.enabled === false ? 1 : 0));
  if (!filtered.length) { 
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⏰</div><div class="empty-state-text">暂无任务</div><div class="empty-state-hint">新增一个定时任务开始自动化管理吧</div></div>`; 
    return; 
  }

  const today = getToday();
  list.innerHTML = filtered.map((t, idx) => {
    const doneToday = (t.completedDates || []).includes(today);
    const color = getTaskColor(idx);
    const icon = getTaskIcon(idx);
    
    return `
    <div class="swipe-wrap" data-id="${t.id}">
      <div class="swipe-actions">
        <div class="swipe-action-btn edit">
          ${iconHTML('edit', { color: '#fff', size: 20 })}
        </div>
        <div class="swipe-action-btn delete">
          ${iconHTML('trash', { color: '#fff', size: 20 })}
        </div>
      </div>
      <div class="swipe-card task-card">
        <div class="task-icon ${color}">
          ${iconHTML(icon, { color: '#fff', size: 26 })}
        </div>
        <div class="task-info">
          <div class="task-name">
            ${escHtml(t.name)}
            ${getStatusTag(doneToday?'已完成':t.status)}
          </div>
          <div class="task-meta">
            <span class="task-meta-item">
              ${iconHTML('clock', { size: 14, color: 'currentColor' })}
              时间: ${t.scheduleTime}
            </span>
            <span class="task-meta-item">
              ${iconHTML('repeat', { size: 14, color: 'currentColor' })}
              重复: ${getRepeatLabel(t)}
            </span>
          </div>
        </div>
        <div class="task-actions">
          <div class="task-action-row">
            <button class="btn btn-ghost btn-icon task-execute-btn" onclick="window._checkinTask('${t.id}')">
              ${iconHTML('play', { size: 16 })}
              <span class="task-action-label">立即执行</span>
            </button>
            <div class="task-action-toggle">
              <span class="task-action-label">${t.enabled!==false?'关闭任务':'开启任务'}</span>
              <div class="toggle ${t.enabled!==false?'on':''}" onclick="window._toggleTaskEnabled('${t.id}')"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  initSwipeActions(list, {
    onEdit: (id) => window._openAutoTaskModal(id),
    onDelete: (id) => window._deleteAutoTask(id)
  });
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

export function toggleTaskEnabled(id, appData, saveAll, renderFn) {
  const task = appData.autotasks.find(t => t.id === id);
  if (!task) return;
  task.enabled = task.enabled === false ? true : false;
  saveAll(); renderFn();
  showToast(task.enabled ? '已开启提醒' : '已关闭提醒', 'info');
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
      enabled: task ? (task.enabled !== false) : true,
      createdAt: task ? task.createdAt : getNow(),
      updatedAt: getNow()
    };
    if (task) { appData.autotasks[appData.autotasks.findIndex(t => t.id === editId)] = data; }
    else { appData.autotasks.push(data); }
    saveAll(); modal.close(); renderFn();
    showToast('定时任务已保存', 'success');
  };
}

export function deleteAutoTask(id, appData, saveAll, renderFn) {
  showConfirm('删除任务', '确定要删除这个定时任务吗？', () => {
    const idx = appData.autotasks.findIndex(t => t.id === id);
    if (idx >= 0) {
      appData.autotasks[idx].deleted = true;
      appData.autotasks[idx].updatedAt = new Date().toISOString();
    }
    saveAll(); renderFn(); showToast('任务已删除', 'info');
  });
}

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
    if (task.enabled === false) return;
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
      showTaskReminder(t);
    });
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
              importance: 4,
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
