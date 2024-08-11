import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileUpload, FaCalendarAlt, FaClipboardList, FaArrowLeft, FaChevronDown, FaUsers, FaQuestionCircle, FaChartBar, FaTimes, FaCheckCircle, FaSearch, FaUserCircle,FaSignOutAlt } from 'react-icons/fa';
import BrowseSection from './BrowseSection';

const TeacherDashboard = () => {
  const [studentsFile, setStudentsFile] = useState(null);
  const [questionsFile, setQuestionsFile] = useState(null);
  const [examData, setExamData] = useState({ courseId: '', courseName: '', batchName: '', examDate: '' });
  const [selectedExamId, setSelectedExamId] = useState('');
  const [currentSection, setCurrentSection] = useState('browse');
  const [exams, setExams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [isCourseIdOpen, setIsCourseIdOpen] = useState(false);
  const [isBatchNameOpen, setIsBatchNameOpen] = useState(false);
  const [courseIds, setCourseIds] = useState([]);
  const [batchNames, setBatchNames] = useState([]);
  const [uploadedStudents, setUploadedStudents] = useState([]);
  const [uploadedQuestions, setUploadedQuestions] = useState([]);
  const [currentUploadSection, setCurrentUploadSection] = useState("")
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5001/api/exams/unique-course-ids')
      .then(response => setCourseIds(response.data))
      .catch(error => console.error('Error fetching course IDs:', error));

    axios.get('http://localhost:5001/api/exams/unique-batches')
      .then(response => setBatchNames(response.data))
      .catch(error => console.error('Error fetching batch names:', error));
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/exams/teacher', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExams(res.data);
      } catch (err) {
        console.error('Failed to fetch exams:', err);
      }
    };

    fetchExams();
  }, []);

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

    fetchUser();
  }, [])

  console.log(user);

  const handleStudentsUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', studentsFile);

    try {
      const res = await axios.post('http://localhost:5001/api/upload/students', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Students uploaded successfully');
      setUploadedStudents(res.data.users);
    } catch (err) {
      console.error('Failed to upload students:', err);
    }
  };


  const handleQuestionsUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', questionsFile);

    try {
      const res = await axios.post('http://localhost:5001/api/upload/questions', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Questions uploaded successfully');
      setUploadedQuestions(res.data.questions);
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
      case 'uploads':
        return (
          <>
            {currentUploadSection === '' && (
              <div className="flex flex-col items-start space-y-4 mb-6">
                <button
                  onClick={() => setCurrentUploadSection('students')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Upload Students CSV
                </button>
                <button
                  onClick={() => setCurrentUploadSection('questions')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Upload Questions CSV
                </button>
              </div>
            )}

            {currentUploadSection === 'students' && (
              <>
              <form onSubmit={handleStudentsUpload} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
                <button onClick={() => setCurrentUploadSection('')} className="mb-4 text-blue-500 flex items-center">
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700 font-bold mb-2">Upload Students CSV:</label>
                  <div className="flex items-center w-full">
                    <label
                      htmlFor="studentsFile"
                      className="flex items-center justify-center border border-dashed rounded py-2 px-3 text-gray-700 cursor-pointer hover:bg-gray-100 transition duration-300 w-full h-24 text-xl"
                    >
                      <FaFileUpload className="mr-2 text-blue-500 text-2xl" />
                      Choose File
                    </label>
                    <input
                      id="studentsFile"
                      type="file"
                      onChange={(e) => setStudentsFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {studentsFile && (
                    <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded shadow-inner">
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-green-500" />
                        <span className="text-gray-700">{studentsFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStudentsFile(null)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                  Upload Students
                </button>
              </form>
               {uploadedStudents.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
                  <h3 className="text-lg font-bold mb-4">Recently Uploaded Students</h3>
                  <table className="min-w-full bg-white border-l">
                    <thead>
                      <tr className='border-t bg-gray-100'>
                        <th className="py-2 border-r border-b border-l border-gray-200">Username</th>
                        <th className="py-2 border-r border-b border-gray-200">SAP ID</th>
                        <th className="py-2 border-r border-b border-gray-200">Class</th>
                        <th className="py-2 border-r border-b border-gray-200">Batch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedStudents.map(student => (
                        <tr key={student.userId} className="border-b text-center">
                          <td className="py-2 border-r border-gray-200">{student.username}</td>
                          <td className="py-2 border-r border-gray-200">{student.sapId}</td>
                          <td className="py-2 border-r border-gray-200">{student.className}</td>
                          <td className="py-2 border-r border-gray-200">{student.batchName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </>
            )}

            {currentUploadSection === 'questions' && (
              <>
              <form onSubmit={handleQuestionsUpload} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
                <button onClick={() => setCurrentUploadSection('')} className="mb-4 text-blue-500 flex items-center">
                  <FaArrowLeft className="mr-2" /> Back
                </button>
                <div className="mb-4 w-full">
                  <label className="block text-gray-700 font-bold mb-2">Upload Questions CSV:</label>
                  <div className="flex items-center w-full">
                    <label
                      htmlFor="questionsFile"
                      className="flex items-center justify-center border border-dashed rounded py-2 px-3 text-gray-700 cursor-pointer hover:bg-gray-100 transition duration-300 w-full h-24 text-xl"
                    >
                      <FaFileUpload className="mr-2 text-blue-500 text-2xl" />
                      Choose File
                    </label>
                    <input
                      id="questionsFile"
                      type="file"
                      onChange={(e) => setQuestionsFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                  {questionsFile && (
                    <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded shadow-inner">
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2 text-green-500" />
                        <span className="text-gray-700">{questionsFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuestionsFile(null)}
                        className="text-red-500 hover:text-red-700 transition duration-300"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                  Upload Questions
                </button>
              </form>
              {uploadedQuestions.length > 0 && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
                <h3 className="text-lg font-bold mb-4">Recently Uploaded Questions</h3>
                <table className="min-w-full bg-white border-l">
                  <thead>
                    <tr className='border-t bg-gray-100'>
                      <th className="py-2 border-r border-b border-gray-200">Question No</th>
                      <th className="py-2 border-r border-b border-gray-200">Question Text</th>
                      <th className="py-2 border-r border-b border-gray-200">Course name</th>
                      <th className="py-2 border-r border-b border-gray-200">Course id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedQuestions.map(question => (
                      <tr key={question.questionNumber} className="border-b">
                        <td className="py-2 text-center border-r border-gray-200">{question.questionNumber}</td>
                        <td className="py-2 pl-3 border-r border-gray-200">{question.questionText}</td>
                        <td className="py-2 text-center border-r border-gray-200">{question.courseName}</td>
                        <td className="py-2 text-center border-r border-gray-200">{question.courseId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
              </>
            )}
          </>
        );

      case 'scheduleExam':
        return (
          <form onSubmit={handleScheduleExam} className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
            {renderBackButton()}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Course ID:</label>
              <div className="relative">
                <div
                  onClick={() => setIsCourseIdOpen(!isCourseIdOpen)}
                  className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                >
                  <span>{examData.courseId || "Select Course ID"}</span>
                  <FaChevronDown className={`ml-2 ${isCourseIdOpen ? 'transform rotate-180' : ''}`} />
                </div>
                {isCourseIdOpen && (
                  <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg h-32 overflow-scroll">
                    {courseIds.map((courseId) => (
                      <div
                        key={courseId}
                        onClick={() => {
                          setExamData({ ...examData, courseId });
                          setIsCourseIdOpen(false);
                        }}
                        className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${examData.courseId === courseId ? 'bg-gray-200' : ''}`}
                      >
                        {courseId}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Course Name / Description:</label>
              <input type="text" name="courseName" value={examData.courseName} onChange={handleChange} className="border rounded py-2 px-3 text-gray-700 w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Batch Name:</label>
              <div className="relative">
                <div
                  onClick={() => setIsBatchNameOpen(!isBatchNameOpen)}
                  className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                >
                  <span>{examData.batchName || "Select Batch Name"}</span>
                  <FaChevronDown className={`ml-2 ${isBatchNameOpen ? 'transform rotate-180' : ''}`} />
                </div>
                {isBatchNameOpen && (
                  <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
                    {batchNames.map((batchName) => (
                      <div
                        key={batchName}
                        onClick={() => {
                          setExamData({ ...examData, batchName });
                          setIsBatchNameOpen(false);
                        }}
                        className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${examData.batchName === batchName ? 'bg-gray-200' : ''}`}
                      >
                        {batchName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Exam Date:</label>
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <input type="date" name="examDate" value={examData.examDate} onChange={handleChange} className="border rounded py-2 px-3 text-gray-700 w-full" />
              </div>
            </div>
            <div className='w-full flex justify-center'>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Schedule Exam</button>
            </div>
          </form>
        );
      case 'viewReport':
        return (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-lg">
            {renderBackButton()}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Select Exam for Report:</label>
              <div className="relative">
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                >
                  <span>{selectedExamId ? exams.find(exam => exam._id === selectedExamId)?.courseName : "Select Exam"}</span>
                  <FaChevronDown className={`ml-2 ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
                {isOpen && (
                  <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
                    {exams.map((exam) => (
                      <div
                        key={exam._id}
                        onClick={() => {
                          setSelectedExamId(exam._id);
                          setIsOpen(false);
                        }}
                        className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${selectedExamId === exam._id ? 'bg-gray-200' : ''}`}
                      >
                        <div>{exam.courseName}</div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <div>Date: {new Date(exam.createdAt).toLocaleDateString()}</div>
                          <div>{exam.batchName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleViewReport} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">View Report</button>
          </div>
        );
      case 'browse':
        return (
          <div>
            <BrowseSection courseIds={courseIds} batchNames={batchNames}/>
          </div>
        );
      default:
        return null;
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <aside className="w-1/5 bg-white shadow-md h-full">
        <button onClick={() => navigate('/')} className="p-4 text-blue-500 flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Login
        </button>
        <div className='text-gray-800 font-semibold border border-gray-200 m-2 p-2 rounded-lg flex flex-col '>
        <FaUserCircle className="text-6xl text-gray-500 mb-3 items-center w-full" />
        <div className='flex items-center justify-around'>
        
          <div>
            <div>
              Username : 
            </div>
            <div>
              Role : 
            </div>
          </div>
          <div>
            <div>{user?.username}</div>
            <div>{user?.role}</div>
          </div>
        </div>
        </div>
        <nav className="mt-8">
          <button
            onClick={() => setCurrentSection('browse')}
            className={`w-full flex items-center p-4 ${currentSection === 'browse' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition duration-300`}
          >
            <FaSearch className="text-blue-500 text-xl mr-2" />
            <span className="text-gray-700 font-semibold">Browse</span>
          </button>
          <button
            onClick={() => {setCurrentSection('uploads'); setCurrentUploadSection("")}}
            className={`w-full flex items-center p-4 ${currentSection === 'uploads' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition duration-300`}
          >
            <FaFileUpload className="text-blue-500 text-xl mr-2" />
            <span className="text-gray-700 font-semibold">Uploads</span>
          </button>
          <button
            onClick={() => setCurrentSection('scheduleExam')}
            className={`w-full flex items-center p-4 ${currentSection === 'scheduleExam' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition duration-300`}
          >
            <FaCalendarAlt className="text-blue-500 text-xl mr-2" />
            <span className="text-gray-700 font-semibold">Schedule Exam</span>
          </button>
          <button
            onClick={() => setCurrentSection('viewReport')}
            className={`w-full flex items-center p-4 ${currentSection === 'viewReport' ? 'bg-gray-200' : 'hover:bg-gray-100'} transition duration-300`}
          >
            <FaChartBar className="text-blue-500 text-xl mr-2" />
            <span className="text-gray-700 font-semibold">View Report</span>
          </button>

        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-8">Teacher Dashboard</h2>
        {renderSection()}
      </main>
    </div>
  );
};

export default TeacherDashboard;
