const mongoose = require("mongoose");

const ListeningSchema = new mongoose.Schema({
    title: { type: String, required: true }, // audio nomi
    audioUrl: { type: String, required: true }, // audio fayl manzili (masalan: /uploads/audio.mp3 yoki cloud link)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Listening", ListeningSchema);
