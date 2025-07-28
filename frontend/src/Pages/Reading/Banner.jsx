import React, { useState } from 'react';
import "./Banner.css";
import { Link } from 'react-router-dom';

function Banner() {
  const [selectedType, setSelectedType] = useState('All');

  const allTests = [

    { id: 1, type: 'Academic', title: 'Cambridge IELTS 20 Academic Reading Test 1' },
    { id: 2, type: 'Academic', title: 'Cambridge IELTS 20 Academic Reading Test 2' },
    { id: 3, type: 'Academic', title: 'Cambridge IELTS 20 Academic Reading Test 3' },
    { id: 4, type: 'Academic', title: 'Cambridge IELTS 20 Academic Reading Test 4' },
    { id: 5, type: 'Academic', title: 'Cambridge IELTS 19 Academic Reading Test 1' },
    { id: 6, type: 'Academic', title: 'Cambridge IELTS 19 Academic Reading Test 2' },
    { id: 7, type: 'Academic', title: 'Cambridge IELTS 19 Academic Reading Test 3' },
    { id: 8, type: 'Academic', title: 'Cambridge IELTS 19 Academic Reading Test 4' },
    { id: 9, type: 'Academic', title: 'Cambridge IELTS 18 Academic Reading Test 1' },
    { id: 10, type: 'Academic', title: 'Cambridge IELTS 18 Academic Reading Test 2' },
    { id: 11, type: 'Academic', title: 'Cambridge IELTS 18 Academic Reading Test 3' },
    { id: 12, type: 'Academic', title: 'Cambridge IELTS 18 Academic Reading Test 4' },
    { id: 13, type: 'Academic', title: 'Cambridge IELTS 17 Academic Reading Test 1' },
    { id: 14, type: 'Academic', title: 'Cambridge IELTS 17 Academic Reading Test 2' },
    { id: 15, type: 'Academic', title: 'Cambridge IELTS 17 Academic Reading Test 3' },

    { id: 16, type: 'General', title: 'IELTS 17 General Training Test 1' },
    { id: 17, type: 'General', title: 'IELTS 17 General Training Test 2' },
    { id: 18, type: 'General', title: 'IELTS 17 General Training Test 3' },
    { id: 19, type: 'General', title: 'IELTS 17 General Training Test 4' },
    { id: 20, type: 'General', title: 'IELTS 16 General Training Test 1' },
    { id: 21, type: 'General', title: 'IELTS 16 General Training Test 2' },
    { id: 22, type: 'General', title: 'IELTS 16 General Training Test 3' },
    { id: 23, type: 'General', title: 'IELTS 16 General Training Test 4' },
    { id: 24, type: 'General', title: 'IELTS 15 General Training Test 1' },
    { id: 25, type: 'General', title: 'IELTS 15 General Training Test 2' },
    { id: 26, type: 'General', title: 'IELTS 15 General Training Test 3' },
    { id: 27, type: 'General', title: 'IELTS 15 General Training Test 4' },
    { id: 28, type: 'General', title: 'IELTS 14 General Training Test 1' },
    { id: 29, type: 'General', title: 'IELTS 14 General Training Test 2' },
    { id: 30, type: 'General', title: 'IELTS 14 General Training Test 3' },
  ];



  const filteredTests = selectedType === 'All'
    ? allTests
    : allTests.filter(test => test.type === selectedType);

  return (
    <div className='banner'>
      <div className="left">
        <div className="filter-heading"><h1>Filters</h1></div>

        <div className="filter-section">
          <label className="filter-label">Search</label>
          <input type="text" className="filter-input" placeholder="Search terms..." />
        </div>

        <div className="filter-section">
          <label className="filter-label">Filter By Question Type</label>
          <input type="text" className="filter-input" placeholder="Select types..." />
        </div>

        <div className="filter-section">
          <label className="filter-label">Filter By Length</label>
          <select className="filter-input">
            <option>All</option>
          </select>
        </div>

        <button className="filter-button">Filter</button>
      </div>

      {/* right */}
      <div className="right">
        <div className="heading">
          <button onClick={() => setSelectedType('All')}>All</button>
          <button onClick={() => setSelectedType('Academic')}>Academic</button>
          <button onClick={() => setSelectedType('General')}>General Training</button>
        </div>

        <div className="box">
          {filteredTests.map(test => (
            <div className="cart" key={test.id}>
              <p>{test.title}</p>
              <Link to="/reading">
                <button>Take_test</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
