import React, { useEffect, useState } from "react";
import axios from "../../Api/Axios";
import "./Listening.css";

function Listening() {
    const [audios, setAudios] = useState([]);
    const [currentAudio, setCurrentAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    // 🔹 Audiosni olish
    const fetchAudios = async () => {
        try {
            const res = await axios.get("/testl/all");
            setAudios(res.data);
        } catch (err) {
            console.error("Audiosni olishda xatolik:", err);
        }
    };

    // 🔹 Audio ijro qilish
    // 🔹 Audio ijro qilish yoki pauza qilish
    const handlePlay = async (id) => {
        try {
            const audioElement = document.getElementById("listening-audio");

            // Agar shu audio bo‘lsa
            if (currentAudio === id) {
                if (isPlaying) {
                    audioElement.pause();
                    setIsPlaying(false);
                } else {
                    await audioElement.play();
                    setIsPlaying(true);
                }
                return;
            }

            // 🔹 Yangi audio tanlansa, backenddan olib kelamiz
            const res = await axios.get(`/testl/${id}`, {
                responseType: "blob",
            });
            const url = URL.createObjectURL(res.data);

            audioElement.src = url;
            await audioElement.play();

            setCurrentAudio(id);
            setIsPlaying(true);

            audioElement.onended = () => {
                setIsPlaying(false);
                setCurrentAudio(null);
            };
        } catch (err) {
            console.error("Audio ijro etishda xato:", err);
        }
    };


    // 🔹 To‘xtatish
    const handleStop = () => {
        const audioElement = document.getElementById("listening-audio");
        audioElement.pause();
        audioElement.currentTime = 0; // boshiga qaytarish
        setIsPlaying(false);
        setCurrentAudio(null);
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
            fetchAudios();
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
                                onClick={() => handlePlay(audio._id)}
                            >
                                {currentAudio === audio._id && isPlaying
                                    ? "⏹ Stop"
                                    : "▶️ Play"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Bitta umumiy audio player */}
            <audio id="listening-audio" controls hidden />
        </div>
    );
}

export default Listening;
