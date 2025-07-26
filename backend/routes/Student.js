const router = require('express').Router()
const mongoose = require('mongoose');
const Student = require('../models/Student')


router.get("/get", async (req, res) => {
    try {
        const users = await Student.find();
        res.send(users);
    } catch (error) {
        res.status(500).send("Error retrieving cats");
    }
})

router.post('/register', async (req, res) => {
    try {
        const { username, email } = req.body;
        const newUser = new User({ username, email });
        await newUser.save();
        res.status(201).send('Foydalanuvchi muvaffaqiyatli qo\'shildi.');
    } catch (error) {
        console.error('Xato yuz berdi:', error);
        res.status(500).send('Serverda xato yuz berdi.');
    }
});

router.delete("/delete/:id", async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    await res.send(`user deleted ${user.name}`)
})

router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Student.findOne({ email });

        if (user) {
            console.log(`Foydalanuvchi kirish qildi: ${user.username}`);
            res.status(200).send(`Xush kelibsiz, ${user.username}!`);
        } else {
            res.status(404).send('Foydalanuvchi topilmadi.');
        }
    } catch (error) {
        console.error('Xato yuz berdi:', error);
        res.status(500).send('Serverda xato yuz berdi.');
    }
});
module.exports = router