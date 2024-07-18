import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaBook, FaEdit, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = location.state || {};
  const [reports, setReports] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (examId) {
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
    }
  }, [examId]);

  const groupReportsByClassAndBatch = (reports) => {
    const groupedReports = {};

    reports.forEach((report) => {
      const { className, batchName } = report.studentId;
      const groupKey = `${className}-${batchName}`;

      if (!groupedReports[groupKey]) {
        groupedReports[groupKey] = [];
      }

      groupedReports[groupKey].push(report);
    });

    return groupedReports;
  };

  const groupedReports = groupReportsByClassAndBatch(reports);

  const handleQuestionChangesClick = async (questionChanges) => {
    try {
      const res = await axios.post(`http://localhost:5001/api/questions/by-ids`, { questionIds: questionChanges }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(res.data);
      setSelectedQuestions(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuestions([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/teacher-dashboard')} 
        className="mb-4 text-blue-500 flex items-center"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Exam Reports</h2>
      {Object.keys(groupedReports).map((groupKey) => {
        const [className, batchName] = groupKey.split('-');
        const groupReports = groupedReports[groupKey];

        return (
          <div key={groupKey} className="mb-8">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">{`Class: ${className}, Batch: ${batchName}`}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-gray-200 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="py-2 px-4">Student ID</th>
                    <th className="py-2 px-4">Username</th>
                    <th className="py-2 px-4">Branch</th>
                    <th className="py-2 px-4">Question Changes</th>
                    <th className="py-2 px-4">Attendance</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {groupReports.map((report) => (
                    <tr key={report.studentId._id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <FaUser className="mr-2 text-gray-500" />
                          {report.studentId.userId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <FaBook className="mr-2 text-gray-500" />
                          {report.studentId.username}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">{report.studentId.branch}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center cursor-pointer" onClick={() => handleQuestionChangesClick(report.questionChanges)}>
                          <FaEdit className="mr-2 text-gray-500" />
                          {report.questionChanges.length}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <FaCalendarAlt className={`mr-2 text-gray-500 ${report.completed ? 'text-green-500' : 'text-red-500'}`} />
                          {report.completed ? 'Present' : 'Absent'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Assigned Questions</h3>
            <ul className="list-disc pl-5">
              {selectedQuestions.map((question) => (
                <li key={question._id} className="mb-2">{question.questionText}</li>
              ))}
            </ul>
            <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
