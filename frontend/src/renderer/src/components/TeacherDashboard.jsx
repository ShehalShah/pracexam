import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileUpload, FaCalendarAlt, FaClipboardList, FaArrowLeft } from 'react-icons/fa';

const TeacherDashboard = () => {
  const [studentsFile, setStudentsFile] = useState(null);
  const [questionsFile, setQuestionsFile] = useState(null);
  const [examData, setExamData] = useState({ courseId: '', courseName: '', batchName: '', examDate: '' });
  const [selectedExamId, setSelectedExamId] = useState('');
  const [currentSection, setCurrentSection] = useState('');
  const navigate = useNavigate();

  const handleStudentsUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', studentsFile);

    try {
      await axios.post('http://localhost:5001/api/upload/students', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Students uploaded successfully');
    } catch (err) {
      console.error('Failed to upload students:', err);
    }
  };

  const handleQuestionsUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', questionsFile);

    try {
      await axios.post('http://localhost:5001/api/upload/questions', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Questions uploaded successfully');
    } catch (err) {
      console.error('Failed to upload questions:', err);
    }
  };

  const handleScheduleExam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/exams/schedule', examData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Exam scheduled successfully');
    } catch (err) {
      console.error('Failed to schedule exam:', err);
    }
  };

  const handleViewReport = () => {
    navigate('/report', { state: { examId: selectedExamId } });
  };

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const renderBackButton = () => (
    <button onClick={() => setCurrentSection('')} className="mb-4 text-blue-500 flex items-center">
      <FaArrowLeft className="mr-2" /> Back
    </button>
  );

  const renderSection = () => {
    switch (currentSection) {
      case 'uploadStudents':
        return (
          <form onSubmit={handleStudentsUpload} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
            {renderBackButton()}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Upload Students CSV:</label>
              <div className="flex items-center">
                <FaFileUpload className="mr-2 text-blue-500" />
                <input type="file" onChange={(e) => setStudentsFile(e.target.files[0])} className="border rounded py-2 px-3 text-gray-700 w-full" />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Upload Students</button>
          </form>
        );
      case 'uploadQuestions':
        return (
          <form onSubmit={handleQuestionsUpload} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
            {renderBackButton()}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Upload Questions CSV:</label>
              <div className="flex items-center">
                <FaFileUpload className="mr-2 text-blue-500" />
                <input type="file" onChange={(e) => setQuestionsFile(e.target.files[0])} className="border rounded py-2 px-3 text-gray-700 w-full" />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Upload Questions</button>
          </form>
        );
      case 'scheduleExam':
        return (
          <form onSubmit={handleScheduleExam} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
            {renderBackButton()}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Course ID:</label>
              <input type="text" name="courseId" value={examData.courseId} onChange={handleChange} className="border rounded py-2 px-3 text-gray-700 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Course Name:</label>
              <input type="text" name="courseName" value={examData.courseName} onChange={handleChange} className="border rounded py-2 px-3 text-gray-700 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Batch Name:</label>
              <input type="text" name="batchName" value={examData.batchName} onChange={handleChange} className="border rounded py-2 px-3 text-gray-700 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Exam Date:</label>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <input type="date" name="examDate" value={examData.examDate} onChange={handleChange} className="border rounded py-2 px-3 text-gray-700 w-full" />
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Schedule Exam</button>
          </form>
        );
      case 'viewReport':
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
            {renderBackButton()}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Select Exam ID for Report:</label>
              <div className="flex items-center">
                <FaClipboardList className="mr-2 text-blue-500" />
                <input type="text" value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} className="border rounded py-2 px-3 text-gray-700 w-full" />
              </div>
            </div>
            <button onClick={handleViewReport} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">View Report</button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
            <button onClick={() => setCurrentSection('uploadStudents')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full">
              Upload Students
            </button>
            <button onClick={() => setCurrentSection('uploadQuestions')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full">
              Upload Questions
            </button>
            <button onClick={() => setCurrentSection('scheduleExam')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full">
              Schedule Exam
            </button>
            <button onClick={() => setCurrentSection('viewReport')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full">
              View Report
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 text-blue-500 flex items-center">
        <FaArrowLeft className="mr-2" /> Back to Login
      </button>
      <h2 className="text-3xl font-bold text-gray-700 mb-8">
      Teacher Dashboard
      </h2>
      {renderSection()}
    </div>
  );
};

export default TeacherDashboard;
