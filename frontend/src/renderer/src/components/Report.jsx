import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaBook, FaEdit, FaCalendarAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Report = () => {
  const location = useLocation();
  const { examId } = location.state || {};
  const [reports, setReports] = useState([]);

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

  return (
    <div className="container mx-auto px-4 py-8">
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
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-gray-500" />
                          {report.studentId.userId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FaBook className="mr-2 text-gray-500" />
                          {report.studentId.username}
                        </div>
                      </td>
                      <td className="py-3 px-4">{report.studentId.branch}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FaEdit className="mr-2 text-gray-500" />
                          {report.questionChanges}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
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
    </div>
  );
};

export default Report;
