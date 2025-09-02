import React, { useEffect, useState } from "react";
import axios from "../../Api/Axios";
import "./Listening.css";

function Listening() {
    const [audios, setAudios] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // 🔹 Form uchun
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    // 🔹 Backenddan audioslarni olish
    const fetchAudios = async () => {
        try {
            const res = await axios.get("/testl/all");
            setAudios(res.data);
        } catch (err) {
            console.error("Audiosni olishda xatolik:", err);
        }
    };

    useEffect(() => {
        fetchAudios();
    }, []);

    const handlePlay = (audioUrl) => {
        const audio = document.getElementById("listening-audio");
        if (currentAudio !== audioUrl) {
            setCurrentAudio(audioUrl);
            setIsPlaying(true);
            setTimeout(() => document.getElementById("listening-audio").play(), 100);
        } else {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
        }
    };

    // 🔹 Audio qo‘shish
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!title || !file) {
            alert("Iltimos, title va audio fayl tanlang!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("audio", file);

        try {
            await axios.post("/testl/add", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setTitle("");
            setFile(null);
            fetchAudios(); // yangilab qo‘yish
            alert("✅ Audio qo‘shildi!");
        } catch (err) {
            console.error("Audio qo‘shishda xatolik:", err);
            alert("❌ Xatolik yuz berdi!");
        }
    };

    return (
        <div className="listening-container">
            <h2>🎧 Listening Practice</h2>

            {/* 🔹 Audio qo‘shish form */}
            <form className="upload-form" onSubmit={handleUpload}>
                <input
                    type="text"
                    placeholder="Audio nomi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button type="submit">➕ Qo‘shish</button>
            </form>

            {/* 🔹 Audios ro‘yxati */}
            {audios.length === 0 ? (
                <p>Hozircha audio yuklanmagan...</p>
            ) : (
                <ul>
                    {audios.map((audio) => (
                        <li key={audio._id} className="audio-item">
                            <span>{audio.title}</span>
                            <button
                                className="play-btn"
                                onClick={() => handlePlay(audio.audioUrl)}
                            >
                                {currentAudio === audio.audioUrl && isPlaying
                                    ? "⏸ Pauza"
                                    : "▶️ Play"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Bitta audio player */}
            <audio id="listening-audio" src={currentAudio || ""} />
        </div>
    );
}

export default Listening;
