const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionNumber: { type: String, required: true },
  questionText: { type: String, required: true },
  courseName: { type: String, required: true },
  courseId: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  image: { type: Buffer },  // Add this line for the image field
});

module.exports = mongoose.model('Question', QuestionSchema);
