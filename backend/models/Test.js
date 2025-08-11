const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: Number,
    value: String
});

const TestSchema = new mongoose.Schema({
    name: String, // <-- Test nomi uchun maydon
    readingText: String,
    testText: String,
    questions: [QuestionSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);