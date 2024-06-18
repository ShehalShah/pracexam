const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  batchName: { type: String, required: true },
  examDate: { type: Date, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  studentStatus: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questionChanges: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  }],
});

module.exports = mongoose.model('Exam', ExamSchema);
