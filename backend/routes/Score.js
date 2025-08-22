const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const User = require("../models/User");
const auth = require("../middleware/auth");

// 1. Foydalanuvchining o‘zini olish
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User topilmadi!" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server xatosi!" });
    }
});

// 2. Teacher bo‘lsa — barcha student natijalari
router.get("/all", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.role !== "teacher") {
            return res.status(403).json({ message: "Siz teacher emassiz!" });
        }

        const scores = await Score.find().populate("student", "fullname email");
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: "Server xatosi!" });
    }
});

// 3. Student o‘z natijalari
router.get("/my", auth, async (req, res) => {
    try {
        const scores = await Score.find({ student: req.user.id }).populate(
            "student",
            "fullname email"
        );
        res.json(scores);
    } catch (err) {
        res.status(500).json({ message: "Server xatosi!" });
    }
});

module.exports = router;
