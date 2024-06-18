import React, { useState } from 'react';
import axios from 'axios';
import Report from './Report';

const TeacherDashboard = () => {
  const [studentsFile, setStudentsFile] = useState(null);
  const [questionsFile, setQuestionsFile] = useState(null);
  const [examData, setExamData] = useState({ courseId: '', courseName: '', batchName: '', examDate: '' });
  const [selectedExamId, setSelectedExamId] = useState('');
  const [showReport, setShowReport] = useState(false);

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
    setShowReport(true);
  };

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <form onSubmit={handleStudentsUpload}>
        <div>
          <label>Upload Students CSV:</label>
          <input type="file" onChange={(e) => setStudentsFile(e.target.files[0])} />
        </div>
        <button type="submit">Upload Students</button>
      </form>
      <form onSubmit={handleQuestionsUpload}>
        <div>
          <label>Upload Questions CSV:</label>
          <input type="file" onChange={(e) => setQuestionsFile(e.target.files[0])} />
        </div>
        <button type="submit">Upload Questions</button>
      </form>
      <form onSubmit={handleScheduleExam}>
        <div>
          <label>Course ID:</label>
          <input type="text" name="courseId" value={examData.courseId} onChange={handleChange} />
        </div>
        <div>
          <label>Course Name:</label>
          <input type="text" name="courseName" value={examData.courseName} onChange={handleChange} />
        </div>
        <div>
          <label>Batch Name:</label>
          <input type="text" name="batchName" value={examData.batchName} onChange={handleChange} />
        </div>
        <div>
          <label>Exam Date:</label>
          <input type="date" name="examDate" value={examData.examDate} onChange={handleChange} />
        </div>
        <button type="submit">Schedule Exam</button>
      </form>
      <div>
        <label>Select Exam ID for Report:</label>
        <input type="text" value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)} />
        <button onClick={handleViewReport}>View Report</button>
      </div>
      {showReport && <Report examId={selectedExamId} />}
    </div>
  );
};

export default TeacherDashboard;
