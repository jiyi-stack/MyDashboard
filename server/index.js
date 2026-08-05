import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ── SQLite 数据库初始化 ──
const db = new Database(join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY, name TEXT, detail TEXT, deadline TEXT,
    status TEXT DEFAULT '未完成', note TEXT,
    createdAt TEXT, updatedAt TEXT
  );
  CREATE TABLE IF NOT EXISTS autotasks (
    id TEXT PRIMARY KEY, name TEXT, description TEXT,
    scheduleType TEXT, scheduleTime TEXT, scheduleDays TEXT, scheduleDate TEXT,
    status TEXT DEFAULT '未完成', completedDates TEXT DEFAULT '[]',
    createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS learning (
    id TEXT PRIMARY KEY, topic TEXT, content TEXT, result TEXT,
    studyTime TEXT, images TEXT DEFAULT '[]', note TEXT, createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY, name TEXT, type TEXT DEFAULT '正向',
    rating INTEGER DEFAULT 3, record TEXT, note TEXT, createdAt TEXT
  );
  CREATE TABLE IF NOT EXISTS finance (
    id TEXT PRIMARY KEY, type TEXT, category TEXT,
    amount REAL, date TEXT, scene TEXT, note TEXT, image TEXT, createdAt TEXT
  );
`);

// ── REST API ──

// 计划清单
app.get('/api/plans', (_req, res) => {
  const rows = db.prepare('SELECT * FROM plans ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/plans', (req, res) => {
  const { id, name, detail, deadline, status, note, createdAt } = req.body;
  db.prepare('INSERT OR REPLACE INTO plans (id,name,detail,deadline,status,note,createdAt) VALUES (?,?,?,?,?,?,?)')
    .run(id, name, detail || '', deadline || '', status || '未完成', note || '', createdAt);
  res.json({ ok: true });
});

app.put('/api/plans/:id', (req, res) => {
  const { name, detail, deadline, status, note } = req.body;
  db.prepare('UPDATE plans SET name=?,detail=?,deadline=?,status=?,note=? WHERE id=?')
    .run(name, detail || '', deadline || '', status, note || '', req.params.id);
  res.json({ ok: true });
});

app.delete('/api/plans/:id', (req, res) => {
  db.prepare('DELETE FROM plans WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// 定时任务
app.get('/api/autotasks', (_req, res) => {
  const rows = db.prepare('SELECT * FROM autotasks ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/autotasks', (req, res) => {
  const { id, name, description, scheduleType, scheduleTime, scheduleDays, scheduleDate, status, completedDates, createdAt } = req.body;
  db.prepare('INSERT OR REPLACE INTO autotasks (id,name,description,scheduleType,scheduleTime,scheduleDays,scheduleDate,status,completedDates,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id, name, description || '', scheduleType, scheduleTime, scheduleDays || '', scheduleDate || '', status || '未完成', JSON.stringify(completedDates || []), createdAt);
  res.json({ ok: true });
});

app.put('/api/autotasks/:id', (req, res) => {
  const { name, description, scheduleType, scheduleTime, scheduleDays, scheduleDate, status, completedDates } = req.body;
  db.prepare('UPDATE autotasks SET name=?,description=?,scheduleType=?,scheduleTime=?,scheduleDays=?,scheduleDate=?,status=?,completedDates=? WHERE id=?')
    .run(name, description || '', scheduleType, scheduleTime, scheduleDays || '', scheduleDate || '', status, JSON.stringify(completedDates || []), req.params.id);
  res.json({ ok: true });
});

app.delete('/api/autotasks/:id', (req, res) => {
  db.prepare('DELETE FROM autotasks WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// 学习记录
app.get('/api/learning', (_req, res) => {
  const rows = db.prepare('SELECT * FROM learning ORDER BY studyTime DESC, createdAt DESC').all();
  res.json(rows.map(r => ({ ...r, images: JSON.parse(r.images || '[]') })));
});

app.post('/api/learning', (req, res) => {
  const { id, topic, content, result, studyTime, images, note, createdAt } = req.body;
  db.prepare('INSERT OR REPLACE INTO learning (id,topic,content,result,studyTime,images,note,createdAt) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, topic, content || '', result || '', studyTime, JSON.stringify(images || []), note || '', createdAt);
  res.json({ ok: true });
});

app.put('/api/learning/:id', (req, res) => {
  const { topic, content, result, studyTime, images, note } = req.body;
  db.prepare('UPDATE learning SET topic=?,content=?,result=?,studyTime=?,images=?,note=? WHERE id=?')
    .run(topic, content || '', result || '', studyTime, JSON.stringify(images || []), note || '', req.params.id);
  res.json({ ok: true });
});

app.delete('/api/learning/:id', (req, res) => {
  db.prepare('DELETE FROM learning WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// 习惯追踪
app.get('/api/habits', (_req, res) => {
  const rows = db.prepare('SELECT * FROM habits ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/habits', (req, res) => {
  const { id, name, type, rating, record, note, createdAt } = req.body;
  db.prepare('INSERT OR REPLACE INTO habits (id,name,type,rating,record,note,createdAt) VALUES (?,?,?,?,?,?,?)')
    .run(id, name, type || '正向', rating || 3, record || '', note || '', createdAt);
  res.json({ ok: true });
});

app.put('/api/habits/:id', (req, res) => {
  const { name, type, rating, record, note } = req.body;
  db.prepare('UPDATE habits SET name=?,type=?,rating=?,record=?,note=? WHERE id=?')
    .run(name, type, rating, record || '', note || '', req.params.id);
  res.json({ ok: true });
});

app.delete('/api/habits/:id', (req, res) => {
  db.prepare('DELETE FROM habits WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// 记账
app.get('/api/finance', (_req, res) => {
  const rows = db.prepare('SELECT * FROM finance ORDER BY date DESC, createdAt DESC').all();
  res.json(rows);
});

app.post('/api/finance', (req, res) => {
  const { id, type, category, amount, date, scene, note, image, createdAt } = req.body;
  db.prepare('INSERT OR REPLACE INTO finance (id,type,category,amount,date,scene,note,image,createdAt) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, type, category, amount, date, scene || '', note || '', image || '', createdAt);
  res.json({ ok: true });
});

app.put('/api/finance/:id', (req, res) => {
  const { type, category, amount, date, scene, note, image } = req.body;
  db.prepare('UPDATE finance SET type=?,category=?,amount=?,date=?,scene=?,note=?,image=? WHERE id=?')
    .run(type, category, amount, date, scene || '', note || '', image || '', req.params.id);
  res.json({ ok: true });
});

app.delete('/api/finance/:id', (req, res) => {
  db.prepare('DELETE FROM finance WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

// 全量同步接口 — 支持双端数据同步
app.post('/api/sync', (req, res) => {
  const { plans, autotasks, learning, habits, finance } = req.body;
  const syncAll = (table, rows) => {
    if (!rows || !rows.length) return;
    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(',');
    const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${cols.join(',')}) VALUES (${placeholders})`);
    const insertMany = db.transaction((items) => { for (const item of items) stmt.run(...cols.map(c => {
      if (c === 'completedDates' || c === 'images') return JSON.stringify(item[c] || (c === 'completedDates' ? [] : []));
      return item[c];
    })); });
    insertMany(rows);
  };
  syncAll('plans', plans);
  syncAll('autotasks', autotasks);
  syncAll('learning', learning);
  syncAll('habits', habits);
  syncAll('finance', finance);

  // 返回服务器全量数据
  res.json({
    plans: db.prepare('SELECT * FROM plans').all(),
    autotasks: db.prepare('SELECT * FROM autotasks').all().map(r => ({ ...r, completedDates: JSON.parse(r.completedDates || '[]') })),
    learning: db.prepare('SELECT * FROM learning').all().map(r => ({ ...r, images: JSON.parse(r.images || '[]') })),
    habits: db.prepare('SELECT * FROM habits').all(),
    finance: db.prepare('SELECT * FROM finance').all(),
  });
});

// 全量获取
app.get('/api/sync', (_req, res) => {
  res.json({
    plans: db.prepare('SELECT * FROM plans').all(),
    autotasks: db.prepare('SELECT * FROM autotasks').all().map(r => ({ ...r, completedDates: JSON.parse(r.completedDates || '[]') })),
    learning: db.prepare('SELECT * FROM learning').all().map(r => ({ ...r, images: JSON.parse(r.images || '[]') })),
    habits: db.prepare('SELECT * FROM habits').all(),
    finance: db.prepare('SELECT * FROM finance').all(),
  });
});

// 健康检查
app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`✅ 全能工作台后端服务运行在 http://localhost:${PORT}`);
});
