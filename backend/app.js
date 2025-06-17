require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();

// 🔓 Enable CORS for frontend access
app.use(cors());

// 🧠 Enable JSON body parsing
app.use(express.json());

// 📦 Import routes
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// 🛣️ Attach routes to base paths
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/feedback', feedbackRoutes);

// ✅ Base route for status check
app.get('/', (req, res) => {
  res.send('Newton Project Tracker API running ✅');
});

// 🚀 Start server after DB sync
const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database sync failed:', err);
});
