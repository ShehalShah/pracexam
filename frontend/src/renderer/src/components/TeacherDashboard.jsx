import React, { useState } from 'react';
import axios from 'axios';

const TeacherDashboard = () => {
  const [studentsFile, setStudentsFile] = useState(null);
  const [questionsFile, setQuestionsFile] = useState(null);

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
    </div>
  );
};

export default TeacherDashboard;
