const express = require('express');
const db = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

const userRoutes = require('./routes/User');
const adminRoutes = require('./routes/Admin');
const customerRoutes = require('./routes/Customer');
const quotationRoute = require('./routes/quotationRoutes');
const poRoutes = require('./routes/po');

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/quotation', quotationRoute);
app.use('/api/po', poRoutes);
db();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send("Server is working fine");
})




