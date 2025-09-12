const express = require("express");
const multer = require("multer");
const Listening = require("../models/Testl");
const router = express.Router();

// Multer memory storage — faylni diskga emas, xotiraga oladi
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Yangi listening audio qo‘shish
router.post("/add", upload.single("audio"), async (req, res) => {
    try {
        console.log("Kelgan file:", req.file); // 🔍 tekshir
        console.log("Kelgan body:", req.body);

        const { title } = req.body;

        if (!title || !req.file) {
            return res.status(400).json({ message: "title va audio kerak!" });
        }

        const newAudio = new Listening({
            title,
            audio: req.file.buffer,
            contentType: req.file.mimetype
        });

        await newAudio.save();

        res.status(201).json({
            message: "Listening audio MongoDBga saqlandi ✅",
            audio: {
                _id: newAudio._id,
                title: newAudio.title
            }
        });
    } catch (err) {
        console.error("Server xatosi:", err);
        res.status(500).json({ message: "Server xatosi!" });
    }
});



// 🔹 Barcha audioslarni olish
router.get("/all", async (req, res) => {
    try {
        const audios = await Listening.find().select("_id title");
        res.json(audios);
    } catch (err) {
        res.status(500).json({ message: "Server xatosi!" });
    }
});

// 🔹 Audio faylni ID bo‘yicha olish
// 🔹 Audio faylni ID bo‘yicha olish
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Noto‘g‘ri ID format!" });
        }

        const audio = await Listening.findById(id);
        if (!audio || !audio.audio) {
            return res.status(404).json({ message: "Audio topilmadi yoki fayl yo‘q" });
        }

        res.set("Content-Type", audio.contentType || "audio/mpeg");

        // 🔹 length xavfsiz tekshiruv
        const buffer = Buffer.from(audio.audio);
        res.set("Content-Length", buffer.length);

        res.end(buffer);
    } catch (err) {
        console.error("Audio olishda xato:", err);
        res.status(500).json({ message: "Server xatosi!" });
    }
});



module.exports = router;
