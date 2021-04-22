require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB Connected');
})

app.use('/api', authRoutes);
app.use('/api', userRoutes);

const port = process.env.PORT || 9000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})