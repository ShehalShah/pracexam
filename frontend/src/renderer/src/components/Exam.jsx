import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const Exam = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  const [question, setQuestion] = useState('');
  const [timer, setTimer] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/exams/${examId}/question`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestion(res.data.questionText);
      } catch (err) {
        console.error('Failed to fetch question:', err);
      }
    };

    fetchQuestion();

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [examId]);

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:5001/api/exams/${examId}/submit`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Exam submitted successfully');
    } catch (err) {
      console.error('Failed to submit exam:', err);
    }
  };

  const handleChangeQuestion = async () => {
    try {
      const res = await axios.post(`http://localhost:5001/api/exams/${examId}/change-question`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestion(res.data.questionText);
    } catch (err) {
      console.error('Failed to change question:', err);
    }
  };

  return (
    <div>
      <h2>Exam</h2>
      <div>Time Remaining: {Math.floor(timer / 60)}:{timer % 60}</div>
      <div>Question: {question}</div>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleChangeQuestion}>Change Question</button>
    </div>
  );
};

export default Exam;
