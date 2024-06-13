import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/exams', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExams(res.data);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      }
    };

    fetchExams();
  }, []);

  const handleEnterExam = (examId) => {
    navigate(`/exam?examId=${examId}`);
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam._id}>
            {exam.courseName}
            <button onClick={() => handleEnterExam(exam._id)}>Enter Exam</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
