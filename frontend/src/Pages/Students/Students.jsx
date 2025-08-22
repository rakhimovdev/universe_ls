import axios from "axios";
import { useEffect, useState } from "react";

function Students() {
    const [students, setStudents] = useState([]);
    const [data, setData] = useState({});
    console.log(data)

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:5000/student/results", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setStudents(res.data))
            .catch((err) => console.error(err.response?.data || err.message));
    }, []);

    return (
        <div>
            <h1>Student Scores</h1>
            {students.length > 0 ? (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Test</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{student.student?.username || "N/A"}</td>
                                <td>{student.student?.email || "N/A"}</td>
                                <td>{student.test}</td>
                                <td>{student.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Students;
