import React, { useState, useEffect } from 'react';
import "./Banner.css";
import { Link } from 'react-router-dom';
import axios from '../../Api/Axios';
import { FaTrash } from "react-icons/fa";
function Banner() {
  const [uploadedTests, setUploadedTests] = useState([]);

  // Fetch uploaded tests from backend
  const fetchTests = () => {
    axios.get('/test/all')
      .then(res => {
        setUploadedTests(res.data || []);
      })
      .catch(() => setUploadedTests([]));
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Testni o'chirish funksiyasi
  const handleDelete = async (id) => {
    if (window.confirm("Testni o'chirishni istaysizmi?")) {
      try {
        await axios.delete(`/test/${id}`);
        fetchTests(); // O'chirgandan so'ng ro'yxatni yangilash
      } catch (err) {
        alert("O'chirishda xatolik yuz berdi!");
      }
    }
  };

  return (
    <div className='banner'>
      <div className="right">
        <div className="heading">
          <h2>Uploaded Tests</h2>
        </div>
        <div className="box">
          {uploadedTests.length > 0 ? (
            uploadedTests.map(test => (
              <div className="cart" key={test._id}>
                <p>{test.name}</p>
                <div className="cart-buttons">
                  <Link to={`/reading/${test._id}`}>
                    <button>Take_test</button>
                  </Link>
                  <button
                    className='delete-btn'
                    onClick={() => handleDelete(test._id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No uploaded tests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
