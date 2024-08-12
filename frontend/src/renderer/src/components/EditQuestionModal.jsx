import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import axios from "axios"

const EditQuestionModal = ({ question, onClose, onSave }) => {
  const [questionNumber, setQuestionNumber] = useState(question.questionNumber);
  const [questionText, setQuestionText] = useState(question.questionText);
  const [image, setImage] = useState(question.image || '');
  const [newImage, setNewImage] = useState(null);
  const [newImage1, setNewImage1] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setNewImage1(file);
  };

  // const handleSubmit = () => {
  //   // Logic for saving changes
  //   onSave({ questionNumber, questionText, image: newImage || image });
  // };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('id', question._id);
    formData.append('questionNumber', questionNumber);
    formData.append('questionText', questionText);
    formData.append('courseName', question.courseName);
    formData.append('courseId', question.courseId);

    if (newImage1) {
      formData.append('image', newImage1);
    }

    try {
      const response = await axios.post('http://localhost:5001/api/questions/update', formData);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Question</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Question Number:</label>
          <input
            type="text"
            value={questionNumber}
            onChange={(e) => setQuestionNumber(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Question Text:</label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Image:</label>
          <div className="flex items-center">
            {newImage ? (
              <img src={newImage} alt="Question" className="w-32 h-32 object-cover rounded border border-gray-300" />
            ) : (
              image ?
                <img src={image} alt="Question" className="w-32 h-32 object-cover rounded border border-gray-300" /> : <p>No image uploaded</p>
            )}
            <label className="flex items-center ml-4 cursor-pointer text-blue-500 hover:text-blue-700">
              <FaUpload className="mr-2" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestionModal;
