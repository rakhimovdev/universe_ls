const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    score: { type: Number, required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // ❗ bu bo‘lishi kerak
});

module.exports = mongoose.model('Test', TestSchema);