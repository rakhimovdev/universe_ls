const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Studentga ulanadi
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test", // Testga ulanadi
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Score", ScoreSchema);
