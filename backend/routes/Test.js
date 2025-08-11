const router = require('express').Router();
const Test = require('../models/Test');

// Test yuklash
router.post('/upload', async (req, res) => {
    try {
        const { name, testText, readingText, questions } = req.body;

        // questions array bo'lishi kerak: [{ id, text, value, longAnswer }, ...]
        const test = new Test({
            name,
            testText,
            readingText,
            questions
        });

        await test.save();
        res.status(201).json(test);
        console.log("✅ Test saqlandi:", test);
    } catch (err) {
        console.error("❌ Xatolik:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Test o‘chirish
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Test.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Test topilmadi' });
        res.json({ message: 'Test o‘chirildi', test: deleted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Oxirgi testni olish
router.get('/last', async (req, res) => {
    try {
        const test = await Test.findOne().sort({ createdAt: -1 });
        if (!test) return res.status(404).json({ message: 'Test topilmadi' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Barcha testlarni olish
router.get('/all', async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bitta testni olish
router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ message: 'Test topilmadi' });
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
