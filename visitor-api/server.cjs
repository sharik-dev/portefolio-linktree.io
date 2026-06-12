const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;
const DATA_FILE = path.join(__dirname, 'visitors.json');
const SECRET = process.env.VISITORS_SECRET || 'changeme';
const MAX_VISITORS = 2000;

app.use(express.json({ limit: '50kb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://sharik.fr');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
}

// POST /api/visitors — enregistre une visite (public)
app.post('/api/visitors', (req, res) => {
  const visitor = req.body;
  if (!visitor || typeof visitor !== 'object' || Array.isArray(visitor)) {
    return res.status(400).json({ error: 'invalid' });
  }

  // IP réelle transmise par nginx
  const realIp =
    req.headers['x-real-ip'] ||
    (req.headers['x-forwarded-for'] ?? '').toString().split(',')[0].trim();
  if (realIp && !visitor.ip) visitor.ip = realIp;

  const list = readData();
  list.push(visitor);
  if (list.length > MAX_VISITORS) list.splice(0, list.length - MAX_VISITORS);
  writeData(list);

  res.json({ ok: true });
});

// GET /api/visitors?token=SECRET — liste les visites
app.get('/api/visitors', (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: 'unauthorized' });
  res.json(readData());
});

// DELETE /api/visitors?token=SECRET — efface tout
app.delete('/api/visitors', (req, res) => {
  if (req.query.token !== SECRET) return res.status(401).json({ error: 'unauthorized' });
  writeData([]);
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Visitor API listening on port ${PORT}`);
});
