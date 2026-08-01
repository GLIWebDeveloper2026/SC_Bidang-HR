const express = require('express');
const cors = require('cors');
require('dotenv').config();

// const jobRoutes = require('../routes/job.routes');
// const adminRoutes = require('./src/routes/admin.route'); // <-- Import route admin
const companyRoutes = require ('./src/routes/company.route')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/companies', companyRoutes); 

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Online',
    message: 'BKK System Backend API is running with Express & Supabase',
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});