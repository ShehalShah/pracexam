import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

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

    // Dummy data for subjects and batches
    useEffect(() => {
        setSubjects(['Math', 'Science', 'History']); // Replace with actual data fetching
        setBatches(['Batch A', 'Batch B', 'Batch C']); // Replace with actual data fetching
    }, []);

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
        // Fetch students based on selectedBatch
        const fetchedStudents = [
            // Replace with actual data fetching
            { userId: 1, username: 'JohnDoe', sapId: '12345', className: '10', batchName: 'Batch A' },
            { userId: 2, username: 'JaneDoe', sapId: '67890', className: '10', batchName: 'Batch B' },
        ];
        setStudents(fetchedStudents);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
            {currentBrowseSection === '' && (
                <div className="flex  items-center mb-6">
                    <button
                        onClick={() => setCurrentBrowseSection('questions')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Browse Questions
                    </button>
                    <button
                        onClick={() => setCurrentBrowseSection('batches')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Browse Batches
                    </button>
                    <button
                        onClick={() => setCurrentBrowseSection('exams')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        Browse Exams
                    </button>
                </div>
            )}

            {currentBrowseSection === 'questions' && (
                <>
                    <div className="relative mb-6">
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
                    {questions.length > 0 && (
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
                            <h3 className="text-lg font-bold mb-4">Questions for {selectedSubject}</h3>
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
                                    {questions.map(question => (
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


            {currentBrowseSection === 'batches' && (
                <>
                    <div className="relative mb-6">
                        <div
                            onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
                            className="cursor-pointer border rounded py-2 px-3 text-gray-700 w-full flex items-center justify-between"
                        >
                            <span>{selectedBatch ? selectedBatch : "Select Batch"}</span>
                            <FaChevronDown className={`ml-2 ${isBatchDropdownOpen ? 'transform rotate-180' : ''}`} />
                        </div>
                        {isBatchDropdownOpen && (
                            <div className="absolute mt-1 w-full bg-white border rounded-lg shadow-lg">
                                {batchNames.map((batch) => (
                                    <div
                                        key={batch}
                                        onClick={() => {
                                            setSelectedBatch(batch);
                                            setIsBatchDropdownOpen(false);
                                        }}
                                        className={`cursor-pointer py-2 px-4 hover:bg-gray-200 ${selectedBatch === batch ? 'bg-gray-200' : ''}`}
                                    >
                                        {batch}
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
                    {students.length > 0 && (
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-full max-w-6xl">
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
                </>
            )}

            {currentBrowseSection === 'exams' && (
                <>
                    {/* Add code for browsing exams here */}
                </>
            )}
        </div>
    );
};

export default BrowseSection;
