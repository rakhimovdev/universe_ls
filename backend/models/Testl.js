const mongoose = require("mongoose");

const ListeningSchema = new mongoose.Schema({
    title: { type: String, required: true },
    audio: { type: Buffer, required: true },       // 🔹 bu bo'lishi shart
    contentType: { type: String, required: true }, // 🔹 MIME type
});

module.exports = mongoose.model("Listening", ListeningSchema);
