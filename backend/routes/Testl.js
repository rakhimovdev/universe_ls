const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Listening = require("../models/Testl");

// 📂 Multer sozlamasi (faylni uploads papkasiga saqlash)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // uploads/ papkasiga saqlanadi
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🔊 Yangi listening audio qo‘shish
router.post("/add", upload.single("audio"), async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !req.file) {
            return res.status(400).json({ message: "title va audio kerak!" });
        }

        // Fayl yo‘li
        const audioUrl = `/uploads/${req.file.filename}`;

        const newAudio = new Listening({ title, audioUrl });
        await newAudio.save();

        res.status(201).json({
            message: "Listening audio qo‘shildi ✅",
            audio: newAudio
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server xatosi!" });
    }
});

module.exports = router;