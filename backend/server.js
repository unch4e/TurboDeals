const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/frontend/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

app.use('/frontend/assets', express.static(path.join(__dirname, '../frontend/assets'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    },
}));
app.use('/frontend/assets/css', express.static(path.join(__dirname, '../frontend/assets/css'), {
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'text/css');
    },
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/register.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/profile.html')));
app.get('/add-car', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/add-car.html')));
app.get('/pages/car-details.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/pages/car-details.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
