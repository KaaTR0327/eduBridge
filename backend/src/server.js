require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');
const apiRouter = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      ok: true,
      service: 'edubridge-backend',
      database: 'connected',
      time: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/overview', (_req, res) => {
  res.redirect('/api/public/overview');
});

app.use('/api', apiRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`EduBridge backend running on http://localhost:${PORT}`);
});
