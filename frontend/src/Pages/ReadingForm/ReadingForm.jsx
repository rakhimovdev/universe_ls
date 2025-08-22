import React, { useState, useEffect } from 'react';
import "./ReadingForm.css";
import { FaClock } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import axios from "../../Api/Axios";

function ReadingForm() {
    const { testId } = useParams();
    const [open, setOpen] = useState(false);
    const [test, setTest] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    // Timer (20 minut = 1200 sekund)
    const [secondsLeft, setSecondsLeft] = useState(1200);

    // Dropdownni ochib yopish
    const toggleDropdown = () => setOpen(!open);

    // Barcha testlarni olish (reading text uchun)
    useEffect(() => {
        const getApi = async () => {
            try {
                const res = await axios.get(`/test/all`);
                setData(res.data);
            } catch {
                console.error("xato");
            }
        }
        getApi();
    }, []);

    // Bitta testni ID bo‘yicha olish
    useEffect(() => {
        axios.get(`/test/${testId}`)
            .then(res => {
                if (!res.data) {
                    setError("Test ma'lumotlari topilmadi.");
                    return;
                }
                setTest(res.data);
                const answerCount = (res.data.testText.match(/\[\[(input|select)\]\]/g) || []).length;
                setUserAnswers(Array(answerCount).fill(""));
            })
            .catch(err => {
                console.error(err);
                setError("Test yuklashda xatolik yuz berdi.");
            });
    }, [testId]);

    // Timer ishlashi
    useEffect(() => {
        if (results) return; // agar tekshirilgan bo‘lsa timer to‘xtaydi

        if (secondsLeft <= 0) {
            handleSubmit();
            return;
        }

        const timerId = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [secondsLeft, results]);

    // Vaqt formatlash
    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Javoblar o‘zgarishi
    const handleChange = (val, index) => {
        const updated = [...userAnswers];
        updated[index] = val;
        setUserAnswers(updated);
    };

    // Javoblarni tekshirish va score saqlash
    const handleSubmit = async () => {
        if (!test?.questions) return;

        const check = userAnswers.map((ans, idx) => {
            const correct = test.questions[idx]?.value?.trim().toLowerCase() || "";
            return ans.trim().toLowerCase() === correct;
        });

        setResults(check);

        // ✅ Score hisoblash
        const score = check.filter(r => r).length;

        try {
            await axios.post(
                "/score/add",
                {
                    testId: test._id,
                    score
                },
                {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                }
            );
            console.log("Score saqlandi ✅");
        } catch (err) {
            console.error("Score saqlashda xato:", err);
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!test) return <p>Loading test...</p>;

    // testText parsing
    const regex = /\[\[(input|select)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    const inputTypes = [];

    while ((match = regex.exec(test.testText)) !== null) {
        parts.push(test.testText.substring(lastIndex, match.index));
        inputTypes.push(match[1]);
        lastIndex = regex.lastIndex;
    }
    parts.push(test.testText.substring(lastIndex));

    return (
        <div className='readingform'>
            <header>
                <h1>{test.name || "Test"}</h1>
                <h1><FaClock /> {formatTime(secondsLeft)}</h1>
                <div className="bar-icon" onClick={toggleDropdown}>&#9776;</div>
                {open && (
                    <div className="dropdown-menu">
                        <button className="menu-item">Enter Focus Mode</button>
                        <Link to="/read" className="menu-item">All IELTS Reading Tests</Link>
                        <Link to="/" className="menu-item">Go to Homepage</Link>
                    </div>
                )}
            </header>
            <div className="contain">
                <div className="reading_text">
                    {data.length > 0 ? (
                        <p>
                            {data[0].readingText || "Reading matni mavjud emas"}
                        </p>
                    ) : (
                        <p style={{ color: "orange" }}>Reading matni mavjud emas</p>
                    )}
                </div>
                <div className="test-content" style={{ fontSize: "18px" }}>
                    {parts.map((part, i) => (
                        <div key={i} style={{ marginBottom: "8px" }}>
                            {part}
                            {i < inputTypes.length && (
                                <>
                                    {inputTypes[i] === "input" ? (
                                        <input
                                            type="text"
                                            value={userAnswers[i] || ""}
                                            onChange={(e) => handleChange(e.target.value, i)}
                                            style={{ margin: "0 5px", padding: "3px" }}
                                            disabled={!!results}
                                        />
                                    ) : (
                                        <select
                                            value={userAnswers[i] || ""}
                                            onChange={(e) => handleChange(e.target.value, i)}
                                            style={{ margin: "0 5px", padding: "3px" }}
                                            disabled={!!results}
                                        >
                                            <option value="">-- Tanlang --</option>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                            <option value="not given">Not Given</option>
                                        </select>
                                    )}
                                    {results && (
                                        <span style={{ color: results[i] ? "green" : "red", marginLeft: 5 }}>
                                            {results[i] ? "✔️" : "❌"}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                    <div>
                        <button
                            onClick={handleSubmit}
                            style={{ background: "blue", color: "white", padding: "10px", marginTop: "20px" }}
                            disabled={!!results}
                        >
                            Check the answers
                        </button>
                    </div>

                    {results && (
                        <div style={{ marginTop: 20 }}>
                            <strong>
                                To‘g‘ri javoblar soni: {results.filter(r => r).length} / {results.length}
                            </strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReadingForm;
