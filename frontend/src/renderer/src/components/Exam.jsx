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
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [actionType, setActionType] = useState(null); // 'submit' or 'change'
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
          setImage(res.data.question.image);
        }
      } catch (err) {
        console.error('Failed to fetch question:', err);
      }
    };

    fetchQuestion();

    clearInterval(interval);

    interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer < 0) {
          alert('Time is up! Exam submitted automatically.');
          handleSubmit(); // Auto-submit when timer reaches 0
          return 0;
        }
        return prevTimer - 1;
      });
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
      setModalMessage('Failed to submit the exam.');
    }
    setShowModal(false);
  };

  const handleChangeQuestion = async () => {
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
      setModalMessage('Question changed successfully.');
    } catch (err) {
      console.error('Failed to change question:', err.message);
      setModalMessage('Failed to change the question.');
    }
    setShowModal(false);
  };

  const confirmAction = (type) => {
    setActionType(type);
    setModalMessage(`Are you sure you want to ${type === 'submit' ? 'submit' : 'change the question'}?`);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-gray-700 mb-8">Exam</h2>
      <div className="flex items-center mb-4 text-lg text-gray-700">
        <FaClock className="mr-2 text-2xl text-blue-500" />
        Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-3xl text-center">
        {image && <img src={`${image}`} alt="Question" className="mx-auto mb-4" />}
        <div className="flex items-center mb-4 text-lg text-gray-700">
          <FaQuestionCircle className="mr-2 text-2xl text-blue-500" />
          Question: {question}
        </div>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => confirmAction('submit')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaCheckCircle className="mr-2" /> Submit
        </button>
        <button
          onClick={() => confirmAction('change')}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 flex items-center"
        >
          <FaSyncAlt className="mr-2" /> Change Question
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-bold text-center mb-4">{modalMessage}</h3>
            <div className="flex justify-between">
              <button
                onClick={actionType === 'submit' ? handleSubmit : handleChangeQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exam;
