import React, { useState, useEffect } from "react";
import axios from "../../Api/Axios";
import "./Solving.css";

function FillInTheBlankTest() {
    const [testName, setTestName] = useState("");
    const [testText, setTestText] = useState(
        "Bu yerda savolingizni yozing va javob joyi uchun [[input]] yozing. Masalan: 2 + 2 = [[input]]"
    );
    const [answers, setAnswers] = useState([]);
    const [readingText, setReadingText] = useState(""); // <-- bu o'zgardi

    // Oxirgi saqlangan testni backenddan yuklash (agar mavjud bo'lsa)
    useEffect(() => {
        axios.get("/user/tests/last")
            .then(res => {
                const d = res.data || {};
                if (d.testText) setTestText(d.testText);
                if (d.name) setTestName(d.name);
                if (d.readingText) setReadingText(d.readingText); // <-- readingText yuklanadi
                if (Array.isArray(d.questions)) {
                    setAnswers(d.questions.map(q => q.value || ""));
                }
            })
            .catch(() => { /* xatolikni tinch qoldiramiz */ });
    }, []);

    // [[input]] placeholderlarini sanash
    const inputCount = (testText.match(/\[\[input\]\]/g) || []).length;

    // Javoblar massivini inputCount bilan sinxronlashtirish
    useEffect(() => {
        setAnswers(prev => {
            const arr = [...prev];
            while (arr.length < inputCount) arr.push("");
            return arr.slice(0, inputCount);
        });
    }, [inputCount]);

    const handleAnswerChange = (idx, value) => {
        setAnswers(prev => {
            const arr = [...prev];
            arr[idx] = value;
            return arr;
        });
    };

    // Savol matnini input bilan chiqarish
    const renderQuestion = () => {
        const parts = (testText || "").split(/\[\[input\]\]/g);
        const elements = [];
        for (let i = 0; i < parts.length; i++) {
            elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
            if (i < parts.length - 1) {
                elements.push(
                    <input
                        key={`input-${i}`}
                        type="text"
                        className="blank-input"
                        value={answers[i] || ""}
                        onChange={e => handleAnswerChange(i, e.target.value)}
                        placeholder="Javob"
                    />
                );
            }
        }
        return elements;
    };

    // Testni yuborish (backendga readingText bilan birga)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/test/upload", {
                name: testName,
                testText,
                questions: answers.map((ans, idx) => ({ id: idx + 1, value: ans })),
                readingText // <-- burada readingText yuborilyapti
            });
            alert("✅ Test va javoblar yuklandi!");
        } catch (err) {
            alert("❌ Xatolik: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container">
            <h2>To‘ldirish uchun savol</h2>

            {/* Test nomi */}
            <input
                type="text"
                className="test-name-input"
                value={testName}
                onChange={e => setTestName(e.target.value)}
                placeholder="Test nomini kiriting"
                style={{ width: "100%", marginBottom: "10px", padding: "8px", fontSize: "16px" }}
            />

            {/* Reading (uzun) matn */}
            <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Reading matni (readingText):</label>
            <textarea
                className="reading-textarea"
                rows={6}
                value={readingText}
                onChange={e => setReadingText(e.target.value)}
                placeholder="Bu yerga reading matnini yozing..."
                style={{ width: "100%", margin: "6px 0 12px", padding: "8px", fontSize: "16px", background: "#f9f9f9" }}
            />

            {/* Savol matni (testText) */}
            <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Savol matni (testText):</label>
            <textarea
                className="test-textarea"
                rows={5}
                value={testText}
                onChange={e => setTestText(e.target.value)}
                placeholder="Savolingizni yozing va [[input]] joyiga javob uchun maydon qo‘shing"
                style={{ width: "100%", marginBottom: "10px", padding: "8px", fontSize: "16px" }}
            />

            {/* Preview */}
            <div className="question-preview">
                <strong>Ko‘rinishi:</strong>
                <div style={{ marginTop: "1rem" }}>{renderQuestion()}</div>
            </div>

            {/* Yuborish */}
            <form onSubmit={handleSubmit}>
                <button type="submit" className="upload-btn" style={{ marginTop: 12 }}>
                    Yuborish
                </button>
            </form>
        </div>
    );
}

export default FillInTheBlankTest;
