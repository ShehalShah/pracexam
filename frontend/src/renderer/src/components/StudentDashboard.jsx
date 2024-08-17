import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaUserCircle, FaSignOutAlt, FaArrowLeft, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('scheduled');
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

  const renderSection = () => {
    switch (currentSection) {
      case 'scheduled':
        return (
          <div className='bg-white shadow-md rounded-lg p-6 w-full flex-1 flex flex-col h-64'>
            <h2 className="text-3xl font-bold text-gray-700 mb-8">Scheduled Exams</h2>
            <ul className='overflow-scroll'>
              {scheduledExams.map((exam) => (
                <li key={exam._id} className="bg-white shadow-md rounded-lg mb-4 p-6 flex justify-between items-center border border-gray-200">
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
          </div>
        );
      case 'completed':
        return (
          <div className='bg-white shadow-md rounded-lg p-6 w-full flex-1 flex flex-col h-64'>
            <h2 className="text-3xl font-bold text-gray-700 mb-8 ">Completed Exams</h2>
            <ul className='overflow-scroll'>
              {completedExams.map((exam) => (
                <li key={exam._id} className="bg-white shadow-md rounded-lg mb-4 p-6 flex justify-between items-center border border-gray-200">
                  <div className="flex items-center">
                    <FaBook className="text-green-500 text-2xl mr-4" />
                    <span className="text-lg font-medium text-gray-700">{exam.courseName}</span>
                  </div>
                  <span className="text-green-500">Completed</span>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <aside className="w-1/4 bg-white shadow-md h-full">
        <div className='text-gray-800 font-semibold border border-gray-200 m-2 p-2 rounded-lg flex flex-col '>
          <button
            onClick={handleLogout}
            className="p-2 mt-2 ml-2 w-24 bg-red-500 text-white text-sm flex items-center rounded-lg shadow-md hover:bg-red-600 transition duration-300 ease-in-out"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
          <FaUserCircle className="text-6xl text-gray-500 mb-3 items-center w-full" />
          <div className='flex items-center justify-around'>
            <div>
              <div>{user?.username}</div>
              <div>{user?.className}: {user?.batchName}</div>
            </div>
          </div>
        </div>
        <nav className="mt-8">
          <button
            onClick={() => setCurrentSection('scheduled')}
            className={`w-full flex items-center p-4 ${currentSection === 'scheduled' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition duration-300`}
          >
            <FaCalendarAlt className="text-blue-500 text-xl mr-2" />
            <span className="text-gray-700 font-semibold">Scheduled </span>
          </button>
          <button
            onClick={() => setCurrentSection('completed')}
            className={`w-full flex items-center p-4 ${currentSection === 'completed' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition duration-300`}
          >
            <FaCheckCircle className="text-blue-500 text-xl mr-2" />
            <span className="text-gray-700 font-semibold">Completed </span>
          </button>
        </nav>
      </aside>
      <main className="flex flex-col flex-1 p-4 h-full">
        <div className='bg-white shadow-md rounded-lg p-6 mb-3 w-full max-w-6xl'>
          <h2 className="text-3xl mx-2 font-bold text-gray-700">Dashboard</h2>
        </div>
        {renderSection()}
      </main>
    </div>
  );
};

export default StudentDashboard;
