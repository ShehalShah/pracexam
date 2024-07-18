import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/auth', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    const fetchExams = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/exams/student', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExams(res.data);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      }
    };

    fetchUser();
    fetchExams();
  }, []);

  const handleEnterExam = (examId) => {
    navigate(`/exam?examId=${examId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  const isExpired = (examDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const exam = new Date(examDate);
    exam.setHours(0, 0, 0, 0);
  
    return exam < today;
  };
  
  const isCompleted = (exam) => {
    const studentStatus = exam.studentStatus.find(status => status.studentId === user?._id);
    return studentStatus ? studentStatus.completed : false;
  };

  const scheduledExams = exams.filter(exam => !isCompleted(exam));
  const completedExams = exams.filter(exam => isCompleted(exam));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Student Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-3xl text-gray-700" />
              <div className="text-gray-700">
                <div className='flex flex-col'>
                  <p className="font-bold">{user.username}</p>
                  <div className='flex'>
                    <p className="text-sm">{user.className}:</p>
                    <p className="text-sm"> {user.batchName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </nav>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-3xl font-bold text-gray-700 mb-8">Available Exams</h2>
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">Scheduled Exams</h3>
          <ul className="mb-8">
            {scheduledExams.map((exam) => (
              <li key={exam._id} className="bg-white shadow-md rounded-lg mb-4 p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <FaBook className="text-blue-500 text-2xl mr-4" />
                  <span className="text-lg font-medium text-gray-700">{exam.courseName}</span>
                </div>
                {isExpired(exam.examDate) ? (
                  <span className="text-red-500">Expired</span>
                ) : (
                  <button
                    onClick={() => handleEnterExam(exam._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Enter Exam
                  </button>
                )}
              </li>
            ))}
          </ul>
          <h3 className="text-2xl font-semibold text-gray-600 mb-4">Completed Exams</h3>
          <ul>
            {completedExams.map((exam) => (
              <li key={exam._id} className="bg-white shadow-md rounded-lg mb-4 p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <FaBook className="text-green-500 text-2xl mr-4" />
                  <span className="text-lg font-medium text-gray-700">{exam.courseName}</span>
                </div>
                <span className="text-green-500">Completed</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
