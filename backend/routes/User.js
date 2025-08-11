const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT qo'shdik
const multer = require('multer');
const Test = require('../models/Test');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, name, lastname, username, password } = req.body;

        // Parolni hash qilish
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            name,
            lastname,
            username,
            password: hashedPassword,
        });

        await user.save();

        console.log('User registered successfully. ID:', user._id);

        res.status(201).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Login route (yangilangan)
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Foydalanuvchini username bo'yicha qidiramiz
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ message: 'User not found or incorrect credentials' });
        }

        // Parolni tekshirish
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ message: 'Incorrect password' });
        }

        // JWT token yaratamiz
        const token = jwt.sign(
            { id: user._id, username: user.username },
            'supersecretkey', // bu joyni .env da saqlash tavsiya qilinadi
            { expiresIn: '1h' }
        );

        console.log('Login successful. User ID:', user._id);

        // Token va foydalanuvchi ma'lumotlarini qaytarish
        res.send({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Multer sozlash
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Save a test
router.post('/tests', async (req, res) => {
    try {
        const { testText, questions } = req.body;
        const test = new Test({ testText, questions });
        await test.save();
        res.status(201).json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get the last saved test
router.get('/tests/last', async (req, res) => {
    try {
        const test = await Test.findOne().sort({ createdAt: -1 });
        if (!test) return res.status(404).json({ message: 'No test found' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
