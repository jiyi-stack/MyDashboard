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

// 建表语句（5张业务表，统一包含 createdAt、updatedAt 和 deleted 软删除标记）
db.exec(`
  CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY, name TEXT, detail TEXT, deadline TEXT,
    status TEXT DEFAULT '未完成', note TEXT,
    createdAt TEXT, updatedAt TEXT, deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS autotasks (
    id TEXT PRIMARY KEY, name TEXT, description TEXT,
    scheduleType TEXT, scheduleTime TEXT, scheduleDays TEXT, scheduleDate TEXT,
    status TEXT DEFAULT '未完成', completedDates TEXT DEFAULT '[]',
    createdAt TEXT, updatedAt TEXT, deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS learning (
    id TEXT PRIMARY KEY, topic TEXT, content TEXT, result TEXT,
    studyTime TEXT, images TEXT DEFAULT '[]', note TEXT,
    createdAt TEXT, updatedAt TEXT, deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY, name TEXT, type TEXT DEFAULT '正向',
    rating INTEGER DEFAULT 3, record TEXT, note TEXT,
    createdAt TEXT, updatedAt TEXT, deleted INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS finance (
    id TEXT PRIMARY KEY, type TEXT, category TEXT,
    amount REAL, date TEXT, scene TEXT, note TEXT, image TEXT,
    createdAt TEXT, updatedAt TEXT, deleted INTEGER DEFAULT 0
  );
`);

// ── 数据库自动迁移：给旧表补充缺失的 updatedAt 字段 ──
function ensureColumn(table, column, def = "TEXT DEFAULT ''") {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  if (!cols.find(c => c.name === column)) {
    console.log(`[DB Migrate] 为 ${table} 表添加 ${column} 字段`);
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`).run();
  }
}

ensureColumn('plans', 'updatedAt');
ensureColumn('autotasks', 'updatedAt');
ensureColumn('learning', 'updatedAt');
ensureColumn('habits', 'updatedAt');
ensureColumn('finance', 'updatedAt');

// 确保 plans 表有 createdAt（理论上已有，保险起见）
ensureColumn('plans', 'createdAt');
ensureColumn('autotasks', 'createdAt');
ensureColumn('learning', 'createdAt');
ensureColumn('habits', 'createdAt');
ensureColumn('finance', 'createdAt');

// 确保所有表有 deleted 软删除字段
ensureColumn('plans', 'deleted', "INTEGER DEFAULT 0");
ensureColumn('autotasks', 'deleted', "INTEGER DEFAULT 0");
ensureColumn('learning', 'deleted', "INTEGER DEFAULT 0");
ensureColumn('habits', 'deleted', "INTEGER DEFAULT 0");
ensureColumn('finance', 'deleted', "INTEGER DEFAULT 0");

console.log('[DB] 数据库初始化完成，5张业务表字段检查通过');

// ── REST API ──

// 计划清单
app.get('/api/plans', (_req, res) => {
  const rows = db.prepare('SELECT * FROM plans WHERE deleted = 0 ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/plans', (req, res) => {
  const { id, name, detail, deadline, status, note, createdAt, updatedAt, deleted } = req.body;
  const now = new Date().toISOString();
  db.prepare('INSERT OR REPLACE INTO plans (id,name,detail,deadline,status,note,createdAt,updatedAt,deleted) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, name, detail || '', deadline || '', status || '未完成', note || '', createdAt || now, updatedAt || now, deleted ? 1 : 0);
  res.json({ ok: true });
});

app.put('/api/plans/:id', (req, res) => {
  const { name, detail, deadline, status, note, updatedAt } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE plans SET name=?,detail=?,deadline=?,status=?,note=?,updatedAt=? WHERE id=?')
    .run(name, detail || '', deadline || '', status, note || '', updatedAt || now, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/plans/:id', (req, res) => {
  const now = new Date().toISOString();
  db.prepare('UPDATE plans SET deleted = 1, updatedAt = ? WHERE id = ?').run(now, req.params.id);
  res.json({ ok: true });
});

// 定时任务
app.get('/api/autotasks', (_req, res) => {
  const rows = db.prepare('SELECT * FROM autotasks WHERE deleted = 0 ORDER BY createdAt DESC').all();
  res.json(rows.map(r => ({ ...r, completedDates: JSON.parse(r.completedDates || '[]') })));
});

app.post('/api/autotasks', (req, res) => {
  const { id, name, description, scheduleType, scheduleTime, scheduleDays, scheduleDate, status, completedDates, createdAt, updatedAt, deleted } = req.body;
  const now = new Date().toISOString();
  db.prepare('INSERT OR REPLACE INTO autotasks (id,name,description,scheduleType,scheduleTime,scheduleDays,scheduleDate,status,completedDates,createdAt,updatedAt,deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, name, description || '', scheduleType, scheduleTime, scheduleDays || '', scheduleDate || '', status || '未完成', JSON.stringify(completedDates || []), createdAt || now, updatedAt || now, deleted ? 1 : 0);
  res.json({ ok: true });
});

app.put('/api/autotasks/:id', (req, res) => {
  const { name, description, scheduleType, scheduleTime, scheduleDays, scheduleDate, status, completedDates, updatedAt } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE autotasks SET name=?,description=?,scheduleType=?,scheduleTime=?,scheduleDays=?,scheduleDate=?,status=?,completedDates=?,updatedAt=? WHERE id=?')
    .run(name, description || '', scheduleType, scheduleTime, scheduleDays || '', scheduleDate || '', status, JSON.stringify(completedDates || []), updatedAt || now, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/autotasks/:id', (req, res) => {
  const now = new Date().toISOString();
  db.prepare('UPDATE autotasks SET deleted = 1, updatedAt = ? WHERE id = ?').run(now, req.params.id);
  res.json({ ok: true });
});

// 学习记录
app.get('/api/learning', (_req, res) => {
  const rows = db.prepare('SELECT * FROM learning WHERE deleted = 0 ORDER BY studyTime DESC, createdAt DESC').all();
  res.json(rows.map(r => ({ ...r, images: JSON.parse(r.images || '[]') })));
});

app.post('/api/learning', (req, res) => {
  const { id, topic, content, result, studyTime, images, note, createdAt, updatedAt, deleted } = req.body;
  const now = new Date().toISOString();
  db.prepare('INSERT OR REPLACE INTO learning (id,topic,content,result,studyTime,images,note,createdAt,updatedAt,deleted) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id, topic, content || '', result || '', studyTime, JSON.stringify(images || []), note || '', createdAt || now, updatedAt || now, deleted ? 1 : 0);
  res.json({ ok: true });
});

app.put('/api/learning/:id', (req, res) => {
  const { topic, content, result, studyTime, images, note, updatedAt } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE learning SET topic=?,content=?,result=?,studyTime=?,images=?,note=?,updatedAt=? WHERE id=?')
    .run(topic, content || '', result || '', studyTime, JSON.stringify(images || []), note || '', updatedAt || now, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/learning/:id', (req, res) => {
  const now = new Date().toISOString();
  db.prepare('UPDATE learning SET deleted = 1, updatedAt = ? WHERE id = ?').run(now, req.params.id);
  res.json({ ok: true });
});

// 习惯追踪
app.get('/api/habits', (_req, res) => {
  const rows = db.prepare('SELECT * FROM habits WHERE deleted = 0 ORDER BY createdAt DESC').all();
  res.json(rows);
});

app.post('/api/habits', (req, res) => {
  const { id, name, type, rating, record, note, createdAt, updatedAt, deleted } = req.body;
  const now = new Date().toISOString();
  db.prepare('INSERT OR REPLACE INTO habits (id,name,type,rating,record,note,createdAt,updatedAt,deleted) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, name, type || '正向', rating || 3, record || '', note || '', createdAt || now, updatedAt || now, deleted ? 1 : 0);
  res.json({ ok: true });
});

app.put('/api/habits/:id', (req, res) => {
  const { name, type, rating, record, note, updatedAt } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE habits SET name=?,type=?,rating=?,record=?,note=?,updatedAt=? WHERE id=?')
    .run(name, type, rating, record || '', note || '', updatedAt || now, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/habits/:id', (req, res) => {
  const now = new Date().toISOString();
  db.prepare('UPDATE habits SET deleted = 1, updatedAt = ? WHERE id = ?').run(now, req.params.id);
  res.json({ ok: true });
});

// 记账
app.get('/api/finance', (_req, res) => {
  const rows = db.prepare('SELECT * FROM finance WHERE deleted = 0 ORDER BY date DESC, createdAt DESC').all();
  res.json(rows);
});

app.post('/api/finance', (req, res) => {
  const { id, type, category, amount, date, scene, note, image, createdAt, updatedAt, deleted } = req.body;
  const now = new Date().toISOString();
  db.prepare('INSERT OR REPLACE INTO finance (id,type,category,amount,date,scene,note,image,createdAt,updatedAt,deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, type, category, amount, date, scene || '', note || '', image || '', createdAt || now, updatedAt || now, deleted ? 1 : 0);
  res.json({ ok: true });
});

app.put('/api/finance/:id', (req, res) => {
  const { type, category, amount, date, scene, note, image, updatedAt } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE finance SET type=?,category=?,amount=?,date=?,scene=?,note=?,image=?,updatedAt=? WHERE id=?')
    .run(type, category, amount, date, scene || '', note || '', image || '', updatedAt || now, req.params.id);
  res.json({ ok: true });
});

app.delete('/api/finance/:id', (req, res) => {
  const now = new Date().toISOString();
  db.prepare('UPDATE finance SET deleted = 1, updatedAt = ? WHERE id = ?').run(now, req.params.id);
  res.json({ ok: true });
});

// 全量同步接口 — 基于时间戳的智能合并 + 软删除
app.post('/api/sync', (req, res) => {
  const { plans, autotasks, learning, habits, finance } = req.body;
  const now = new Date().toISOString();

  // 智能合并：按 id 比较 updatedAt，谁新用谁的；不主动删除，用软删除标记
  function smartSyncTable(table, items, jsonCols = []) {
    if (!items || !items.length) return;

    const existingStmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`);

    const allKeys = new Set();
    for (const item of items) {
      for (const key of Object.keys(item)) {
        allKeys.add(key);
      }
    }
    allKeys.add('deleted');
    allKeys.add('updatedAt');
    allKeys.add('createdAt');
    allKeys.add('id');

    const insertCols = Array.from(allKeys);
    const insertPlaceholders = insertCols.map(() => '?');
    const updateSets = insertCols.filter(k => k !== 'id').map(k => `${k} = ?`);

    const insertStmt = db.prepare(`INSERT OR REPLACE INTO ${table} (${insertCols.join(',')}) VALUES (${insertPlaceholders.join(',')})`);
    const updateStmt = db.prepare(`UPDATE ${table} SET ${updateSets.join(',')} WHERE id = ?`);

    const syncOne = db.transaction((item) => {
      const existing = existingStmt.get(item.id);

      if (!existing) {
        const vals = insertCols.map(c => {
          if (jsonCols.includes(c)) return JSON.stringify(item[c] || []);
          if (c === 'deleted') return item.deleted ? 1 : 0;
          if (item[c] !== undefined) return item[c];
          return c === 'deleted' ? 0 : '';
        });
        insertStmt.run(...vals);
        return;
      }

      const serverTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
      const clientTime = new Date(item.updatedAt || item.createdAt || 0).getTime();

      if (clientTime >= serverTime) {
        const vals = [];
        for (const key of insertCols) {
          if (key === 'id') continue;
          if (jsonCols.includes(key)) vals.push(JSON.stringify(item[key] || []));
          else if (key === 'deleted') vals.push(item.deleted ? 1 : 0);
          else if (item[key] !== undefined) vals.push(item[key]);
          else vals.push(key === 'deleted' ? 0 : '');
        }
        vals.push(item.id);
        updateStmt.run(...vals);
      }
    });

    for (const item of items) {
      syncOne(item);
    }
  }

  smartSyncTable('plans', plans || []);
  smartSyncTable('autotasks', autotasks || [], ['completedDates']);
  smartSyncTable('learning', learning || [], ['images']);
  smartSyncTable('habits', habits || []);
  smartSyncTable('finance', finance || []);

  // 返回服务器全量数据（包括已软删除的，让前端自己处理）
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
  console.log(`✅ 星河浅滩后端服务运行在 http://localhost:${PORT}`);
});
