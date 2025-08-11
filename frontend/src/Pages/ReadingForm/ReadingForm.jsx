import React, { useState, useEffect } from 'react';
import "./ReadingForm.css";
import { FaClock } from "react-icons/fa6";
import { Link, useParams } from 'react-router-dom';
import axios from "../../Api/Axios";

function ReadingForm() {
    const { testId } = useParams();
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState(new Date());
    const [test, setTest] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [longAnswer, setLongAnswer] = useState("");

    // Dropdownni ochib yopish
    const toggleDropdown = () => setOpen(!open);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (num) => num.toString().padStart(2, '0');
    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const seconds = formatTime(time.getSeconds());

    // Fetch test by ID
    useEffect(() => {
        axios.get(`/test/${testId}`)
            .then(res => {
                if (!res.data) {
                    setError("Test ma'lumotlari topilmadi.");
                    return;
                }
                setTest(res.data);
                const answerCount = res.data.questions?.length || 0;
                setUserAnswers(Array(answerCount).fill(""));
            })
            .catch(err => {
                console.error(err);
                setError("Test yuklashda xatolik yuz berdi.");
            });
    }, [testId]);

    // Input o'zgarganda userAnswers ni yangilash
    const handleChange = (val, index) => {
        const updated = [...userAnswers];
        updated[index] = val;
        setUserAnswers(updated);
    };

    // Javoblarni tekshirish
    const handleSubmit = () => {
        if (!test?.questions) return;
        const check = userAnswers.map((ans, idx) => {
            const correct = test.questions[idx]?.value?.trim().toLowerCase() || "";
            return ans.trim().toLowerCase() === correct;
        });
        setResults(check);
    };

    // Agar xato bo'lsa
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    // Yuklanish holati
    if (!test) return <p>Loading test...</p>;

    // split() xatosini oldini olish
    const parts = test?.testText ? test.testText.split(/\[\[input\]\]/g) : [];

    return (
        <div className='readingform'>
            <header>
                <h1>{test.name || "Test"}</h1>
                <h1><FaClock /> {`${hours}:${minutes}:${seconds}`}</h1>
                <div className="bar-icon" onClick={toggleDropdown}>
                    &#9776;
                </div>
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
                    {test.questions.map((q, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <p>{q.readingText}</p>
                        </div>
                    ))}

                </div>
            </div>
            <div className="test-content">
                <h2>{test.name || "Test"}</h2>
                {parts.length > 0 ? (
                    <p style={{ fontSize: "18px" }}>
                        {parts.map((part, i) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < userAnswers.length && (
                                    <>
                                        <input
                                            type="text"
                                            value={userAnswers[i]}
                                            onChange={(e) => handleChange(e.target.value, i)}
                                            style={{ margin: "0 5px", padding: "3px" }}
                                            disabled={!!results}
                                        />
                                        {results && (
                                            <span style={{ color: results[i] ? "green" : "red", marginLeft: 5 }}>
                                                {results[i] ? "✔️" : "❌"}
                                            </span>
                                        )}
                                    </>
                                )}
                            </React.Fragment>
                        ))}
                    </p>
                ) : (
                    <p style={{ color: "orange" }}>Test matni mavjud emas</p>
                )}

                <button
                    onClick={handleSubmit}
                    style={{ background: "blue", color: "white", padding: "10px", marginTop: "20px" }}
                    disabled={!!results}
                >
                    Check the answers
                </button>
                {results && (
                    <div style={{ marginTop: 20 }}>
                        <strong>
                            {results.every(r => r)
                                ? "Barcha javoblar to'g'ri!"
                                : "Ba'zi javoblar noto'g'ri, qayta urinib ko'ring."}
                        </strong>
                        <div style={{ marginTop: 10 }}>
                            To‘g‘ri javoblar soni: {results.filter(r => r).length} / {results.length}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReadingForm;
