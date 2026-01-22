require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send({ status: 'Electricity Billing API', uptime: process.uptime() }));

// Mount API routes
const apiRouter = require('./routes');
app.use('/api', apiRouter);

// Optional: synchronize models when the server starts (creates tables if missing)
if (process.env.SYNC_DB_ON_START === 'true') {
  sequelize.sync({ alter: true }).then(() => console.log('DB synced (alter)')).catch(err => console.error('DB sync error', err));
}

const PORT = process.env.PORT || 5000;
sequelize.authenticate().then(() => {
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Unable to connect to DB:', err);
});

module.exports = app;
