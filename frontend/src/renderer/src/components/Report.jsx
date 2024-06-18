import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Report = ({ examId }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/reports/exam/${examId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      }
    };

    fetchReports();
  }, [examId]);

  return (
    <div>
      <h2>Exam Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Question Changes</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.studentId._id}>
              <td>{report.studentId.userId}</td>
              <td>{report.studentId.courseId}</td>
              <td>{report.studentId.courseName}</td>
              <td>{report.questionChanges}</td>
              <td>{report.completed ? 'Present' : 'Absent'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
