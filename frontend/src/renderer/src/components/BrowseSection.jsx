import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaArrowLeft, FaQuestionCircle, FaFileAlt, FaLayerGroup, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import EditQuestionModal from './EditQuestionModal';

const BrowseSection = ({ courseIds, batchNames }) => {
    const [currentBrowseSection, setCurrentBrowseSection] = useState('');
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [batches, setBatches] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [students, setStudents] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const openEditModal = (question) => {
        setSelectedQuestion(question);
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = async (updatedQuestion) => {
        console.log("updated", updatedQuestion);
        handleFetchQuestions()
    };

    const handleFetchQuestions = async () => {
        if (!selectedSubject) return;

        try {
            const res = await axios.get(`http://localhost:5001/api/questions/course/${selectedSubject}`);
            setQuestions(res.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };


    const handleFetchStudents = async () => {
        if (!selectedBatch) return;

        try {
            const response = await axios.post('http://localhost:5001/api/auth/students/batch', {
                batchName: selectedBatch
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    useEffect(() => {
        const fetchExams = async () => {
          try {
            const response = await axios.get('http://localhost:5001/api/exams/exams');
            setExams(response.data); // Store fetched exams in state
          } catch (err) {
            console.error('Error fetching exams:', err);
            setError('Error fetching exams'); // Set error if request fails
          } finally {
            setLoading(false); // Set loading to false once fetching is done
          }
        };
    
        fetchExams(); // Call the fetch function
      }, []);

    
    const renderBackButton = () => (
        <button
            onClick={()=>setCurrentBrowseSection("")}
            className="mb-4 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900 transition duration-300 ease-in-out flex text-sm items-center px-5 py-2 rounded-lg border border-gray-300"
        >
            <FaArrowLeft className="" />
        </button>
    );

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl h-full ">
            {currentBrowseSection === '' && (
                <div className="flex items-center mb-6 space-x-6 justify-start pt-6">
                    <button
                        onClick={() => setCurrentBrowseSection('questions')}
                        className="flex flex-col items-center bg-gray-100 text-black border border-dashed border-gray-300 px-10 py-8 rounded hover:bg-gray-200 transition duration-300 text-xl w-72"
                    >
                        <FaQuestionCircle className="mr-2 text-gray-800 text-3xl mb-2" />
                        Questions
                    </button>
                    <button
                        onClick={() => setCurrentBrowseSection('batches')}
                        className="flex flex-col items-center bg-gray-100 text-black border border-dashed border-gray-300 px-10 py-8 rounded hover:bg-gray-200 transition duration-300 text-xl w-72"
                    >
                        <FaLayerGroup className="mr-2 text-gray-800 text-3xl mb-2" />
                        Batches
                    </button>
                    <button
                        onClick={() => setCurrentBrowseSection('exams')}
                        className="flex flex-col items-center bg-gray-100 text-black border border-dashed border-gray-300 px-10 py-8 rounded hover:bg-gray-200 transition duration-300 text-xl w-72"
                    >
                        <FaFileAlt className="mr-2 text-gray-800 text-3xl mb-2" />
                        Exams
                    </button>
                </div>

            )}

            {currentBrowseSection === 'questions' && (
                <div className='pt-2'>
                    {renderBackButton()}
                    <div className='flex space-x-2'>
                        <div className="relative mb-6 w-96">
                            <div
                                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                                className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                            >
                                <span>{selectedSubject ? selectedSubject : "Select Subject"}</span>
                                <FaChevronDown className={`ml-2 ${isSubjectDropdownOpen ? 'transform rotate-180' : ''}`} />
                            </div>
                            {isSubjectDropdownOpen && (
                                <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
                                    {courseIds.map((courseId) => (
                                        <div
                                            key={courseId}
                                            onClick={() => {
                                                setSelectedSubject(courseId);
                                                setIsSubjectDropdownOpen(false);
                                            }}
                                            className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${selectedSubject === courseId ? 'bg-gray-200' : ''}`}
                                        >
                                            {courseId}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleFetchQuestions}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-6"
                        >
                            Submit
                        </button>
                    </div>
                    {questions.length > 0 && (
                        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
                            <h3 className="text-lg font-bold mb-4">Questions for {selectedSubject}</h3>
                            <table className="min-w-full bg-white border-l">
                                <thead>
                                    <tr className='border-t bg-gray-100'>
                                        <th className="py-2 border-r border-b border-gray-200">Question No</th>
                                        <th className="py-2 border-r border-b border-gray-200">Question Text</th>
                                        <th className="py-2 border-r border-b border-gray-200">Course name</th>
                                        <th className="py-2 border-r border-b border-gray-200">Course id</th>
                                        <th className="py-2 border-r border-b border-gray-200">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map(question => (
                                        <tr key={question._id} className="border-b">
                                            <td className="py-2 text-center border-r border-gray-200">{question.questionNumber}</td>
                                            <td className="py-2 pl-3 border-r border-gray-200">{question.questionText}</td>
                                            <td className="py-2 text-center border-r border-gray-200">{question.courseName}</td>
                                            <td className="py-2 text-center border-r border-gray-200">{question.courseId}</td>
                                            <td className="py-2 flex items-center justify-center text-center border-r border-gray-200">
                                                <button
                                                    onClick={() => openEditModal(question)}
                                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300 flex items-center justify-center"
                                                >
                                                    <FaEdit className="text-xl" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {isEditModalOpen && (
                                <EditQuestionModal
                                    question={selectedQuestion}
                                    onClose={() => setIsEditModalOpen(false)}
                                    onSave={handleSaveChanges}
                                />
                            )}
                        </div>
                    )}

                </div>
            )}


            {currentBrowseSection === 'batches' && (
                <div className='pt-2'>
                    {renderBackButton()}
                    <div className='flex space-x-2'>
                        <div className="relative mb-6 w-96">
                            <div
                                onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                                className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                            >
                                <span>{selectedBatch ? selectedBatch : "Select Batch"}</span>
                                <FaChevronDown className={`ml-2 ${isBatchDropdownOpen ? 'transform rotate-180' : ''}`} />
                            </div>
                            {isBatchDropdownOpen && (
                                <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
                                    {batchNames.map((batchName) => (
                                        <div
                                            key={batchName}
                                            onClick={() => {
                                                setSelectedBatch(batchName);
                                                setIsBatchDropdownOpen(false);
                                            }}
                                            className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${selectedBatch === batchName ? 'bg-gray-200' : ''}`}
                                        >
                                            {batchName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleFetchStudents}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-6"
                        >
                            Submit
                        </button>
                    </div>
                    {students.length > 0 && (
                        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
                            <h3 className="text-lg font-bold mb-4">Students in {selectedBatch}</h3>
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
                                    {students.map(student => (
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
                </div>
            )}


            {currentBrowseSection === 'exams' && (
               <div className="pt-2">
               {renderBackButton()}
               <h3 className="text-lg font-bold mb-4">Exams List</h3>
               {/* <div className='flex space-x-2 mb-6'>
                   <div className="relative mb-6 w-96">
                       <div
                           onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                           className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                       >
                           <span>{selectedBatch ? selectedBatch : "Select Batch"}</span>
                           <FaChevronDown className={`ml-2 ${isBatchDropdownOpen ? 'transform rotate-180' : ''}`} />
                       </div>
                       {isBatchDropdownOpen && (
                           <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
                               {batchNames.map((batchName) => (
                                   <div
                                       key={batchName}
                                       onClick={() => {
                                           setSelectedBatch(batchName);
                                           setIsBatchDropdownOpen(false);
                                       }}
                                       className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${selectedBatch === batchName ? 'bg-gray-200' : ''}`}
                                   >
                                       {batchName}
                                   </div>
                               ))}
                           </div>
                       )}
                   </div>
                   <button
                       onClick={handleFetchExams}
                       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-6"
                   >
                       Submit
                   </button>
               </div> */}
               
               <div className="overflow-x-auto ">
                   <table className="min-w-full bg-white border-l">
                       <thead>
                           <tr className="border-t bg-gray-100">
                               <th className="py-2 border-r border-b border-gray-200">Course Name</th>
                               <th className="py-2 border-r border-b border-gray-200">Course ID</th>
                               <th className="py-2 border-r border-b border-gray-200">Batch Name</th>
                               <th className="py-2 border-r border-b border-gray-200">Exam Date</th>
                               <th className="py-2 border-r border-b border-gray-200">Total Students</th>
                               <th className="py-2 border-r border-b border-gray-200">Completed</th>
                               <th className="py-2 border-r border-b border-gray-200">Actions</th>
                           </tr>
                       </thead>
                       <tbody>
                           {exams.length === 0 ? (
                               <tr>
                                   <td colSpan="7" className="py-4 text-center text-gray-500">No exams available</td>
                               </tr>
                           ) : (
                               exams.map((exam) => (
                                   <tr key={exam._id} className="border-b border-gray-200 hover:bg-gray-100">
                                       <td className="py-2 text-center border-r border-gray-200">{exam.courseName}</td>
                                       <td className="py-2 text-center border-r border-gray-200">{exam.courseId}</td>
                                       <td className="py-2 text-center border-r border-gray-200">{exam.batchName}</td>
                                       <td className="py-2 text-center border-r border-gray-200">{new Date(exam.examDate).toLocaleDateString()}</td>
                                       <td className="ppy-2 text-center border-r border-gray-200">{exam.studentStatus.length}</td>
                                       <td className="py-2 text-center border-r border-gray-200">
                                           {exam.studentStatus.filter(s => s.completed).length}/{exam.studentStatus.length}
                                       </td>
                                       <td className="py-2 text-center border-r border-gray-200">
                                           <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300">View</button>
                                       </td>
                                   </tr>
                               ))
                           )}
                       </tbody>
                   </table>
               </div>
           </div>
           
            )}
        </div>
    );
};

export default BrowseSection;
