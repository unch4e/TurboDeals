const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require("multer");
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

router.post('/register', async (req, res) => {
    try {
        let { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        username = username.toLowerCase();

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '48h' });

        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username } });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        let { username, password } = req.body;

        console.log('Полученные данные для входа:', username, password);

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        username = username.toLowerCase(); 

        const user = await User.findOne({ username });
        console.log('Найденный пользователь:', user);

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        console.log('Пароль в базе:', user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Пароли совпадают:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '9999h' });

        console.log('Сгенерированный JWT:', token);

        res.status(200).json({ token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
