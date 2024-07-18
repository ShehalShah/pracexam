import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaCheckCircle, FaSyncAlt } from 'react-icons/fa';

const Exam = () => {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId');
  const [question, setQuestion] = useState('');
  const [timer, setTimer] = useState(3600); // 1 hour in seconds
  const [image, setImage] = useState(null); // State for image
  const navigate = useNavigate();
  let interval;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/exams/start/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestion(res.data.question.questionText);
        if (res.data.question.image) {
          // setImage(res.data.question.image);

          // // Convert the buffer to a base64 string
          // const base64String = res.data.question.image.data.toString('base64');

          // // Create a data URL for the image
          // const imageUrl = `data:image/jpeg;base64,${base64String}`;
          setImage(res.data.question.image)

        }
      } catch (err) {
        console.error('Failed to fetch question:', err);
      }
    };

    fetchQuestion();

    interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [examId]);

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:5001/api/exams/submit/${examId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      clearInterval(interval); // Stop the timer
      alert('Exam submitted successfully');
      navigate('/student-dashboard'); // Redirect to StudentDashboard
    } catch (err) {
      console.error('Failed to submit exam:', err);
    }
  };

  const handleChangeQuestion = async () => {
    console.log("hi");
    try {
      const res = await axios.post(`http://localhost:5001/api/exams/change-question/${examId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestion(res.data.question.questionText);
      if (res.data.question.image) {
        setImage(res.data.question.image);
      } else {
        setImage(null);
      }
    } catch (err) {
      console.error('Failed to change question:', err.message);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">Exam</h2>
      <div className="flex items-center mb-4 text-lg text-gray-700">
        <FaClock className="mr-2 text-2xl text-blue-500" />
        Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-3xl text-center">
        {image && <img src={`data:image/jpeg;base64,${image}`} alt="Question" className="mx-auto mb-4" />}
        <div className="flex items-center mb-4 text-lg text-gray-700">
          <FaQuestionCircle className="mr-2 text-2xl text-blue-500" />
          Question: {question}
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaCheckCircle className="mr-2" /> Submit
        </button>
        <button
          onClick={handleChangeQuestion}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 flex items-center"
        >
          <FaSyncAlt className="mr-2" /> Change Question
        </button>
      </div>
    </div>
  );
};

export default Exam;
