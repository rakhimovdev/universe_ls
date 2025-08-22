import React, { useState, useEffect } from "react";
import axios from "../../Api/Axios";
import "./Solving.css";

function FillInTheBlankTest() {
    const [testName, setTestName] = useState("");
    const [testText, setTestText] = useState(
        "2 + 2 = [[input]]\nBu gap rostmi? [[select]]\nYoki: [[input:text]]"
    );
    const [answers, setAnswers] = useState([]); // [{ value: string, type: string }]
    const [readingText, setReadingText] = useState("");

    // Test ma'lumotlarini olish
    useEffect(() => {
        axios
            .get("/user/tests/last")
            .then((res) => {
                const d = res.data || {};
                if (d.testText) setTestText(d.testText);
                if (d.name) setTestName(d.name);
                if (d.readingText) setReadingText(d.readingText);
                if (Array.isArray(d.questions)) {
                    setAnswers(
                        d.questions.map((q) => ({
                            value: q.value || "",
                            type: q.type || "text",
                        }))
                    );
                }
            })
            .catch(() => { });
    }, []);

    // [[input]], [[select]], [[input:type]] larni aniqlash uchun regex
    // match[0] = to‘liq [[...]]
    // match[1] = input, input:type yoki select
    // match[2] = type (agar input:type bo‘lsa)
    const inputMatches = [...testText.matchAll(/\[\[(input(?::(\w+))?|select)\]\]/g)];
    const inputCount = inputMatches.length;

    // answers massivini inputlar soniga moslashtirish
    useEffect(() => {
        setAnswers((prev) => {
            const arr = [...prev];
            while (arr.length < inputCount) {
                const match = inputMatches[arr.length];
                let type = "text";

                if (match[1].startsWith("input")) {
                    type = match[2] || "text";
                } else if (match[1] === "select") {
                    type = "select";
                }

                arr.push({ value: "", type });
            }
            return arr.slice(0, inputCount);
        });
    }, [testText, inputCount]);

    // Javob o'zgarganda
    const handleAnswerChange = (idx, value) => {
        setAnswers((prev) => {
            const arr = [...prev];
            arr[idx] = { ...arr[idx], value };
            return arr;
        });
    };

    // Test matnini inputlarga bo‘lib render qilish
    const renderQuestion = () => {
        // testText ni inputlar bo‘yicha bo‘lamiz
        const parts = testText.split(/\[\[(?:input(?::\w+)?|select)\]\]/g);
        const elements = [];

        for (let i = 0; i < parts.length; i++) {
            elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
            if (i < inputCount) {
                const match = inputMatches[i];
                let type = "text";
                if (match[1].startsWith("input")) {
                    type = match[2] || "text";
                } else if (match[1] === "select") {
                    type = "select";
                }

                if (type === "text") {
                    elements.push(
                        <input
                            key={`input-text-${i}`}
                            type="text"
                            className="blank-input"
                            value={answers[i]?.value || ""}
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            placeholder="Javob"
                        />
                    );
                } else if (type === "select") {
                    elements.push(
                        <select
                            key={`input-select-${i}`}
                            value={answers[i]?.value || ""}
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            className="choice-select"
                        >
                            <option value="">-- Tanlang --</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                            <option value="not given">Not Given</option>
                        </select>
                    );
                } else {
                    // default input (agar boshqa type bo‘lsa)
                    elements.push(
                        <input
                            key={`input-other-${i}`}
                            type="text"
                            className="blank-input"
                            value={answers[i]?.value || ""}
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            placeholder="Javob"
                        />
                    );
                }
            }
        }

        return elements;
    };

    // Test va javoblarni serverga yuborish
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/test/upload", {
                name: testName,
                testText,
                questions: answers.map((ans, idx) => ({
                    id: idx + 1,
                    value: ans.value,
                    type: ans.type,
                })),
                readingText,
            });
            alert("✅ Test va javoblar yuklandi!");
        } catch (err) {
            alert("❌ Xatolik: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container">
            <h2>To‘ldirish uchun savol</h2>

            <input
                type="text"
                className="test-name-input"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test nomini kiriting"
                style={{ width: "100%", marginBottom: "10px", padding: "8px", fontSize: "16px" }}
            />

            <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Reading matni:</label>
            <textarea
                className="reading-textarea"
                rows={6}
                value={readingText}
                onChange={(e) => setReadingText(e.target.value)}
                placeholder="Bu yerga reading matnini yozing..."
                style={{
                    width: "100%",
                    margin: "6px 0 12px",
                    padding: "8px",
                    fontSize: "16px",
                    background: "#f9f9f9",
                }}
            />

            <label style={{ display: "block", marginTop: 8, marginBottom: 6 }}>Savol matni:</label>
            <textarea
                className="test-textarea"
                rows={5}
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Savolingizni yozing va [[input]] yoki [[select]] joyiga javob uchun maydon qo‘shing"
                style={{ width: "100%", marginBottom: "10px", padding: "8px", fontSize: "16px" }}
            />

            <div className="question-preview" style={{ whiteSpace: "pre-wrap" }}>
                <strong>Ko‘rinishi:</strong>
                <div style={{ marginTop: "1rem" }}>{renderQuestion()}</div>
            </div>

            <form onSubmit={handleSubmit}>
                <button type="submit" className="upload-btn" style={{ marginTop: 12 }}>
                    Yuborish
                </button>
            </form>
        </div>
    );
}

export default FillInTheBlankTest;
