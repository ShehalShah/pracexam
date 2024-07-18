const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  batchName: { type: String, required: true },
  examDate: { type: Date, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  studentStatus: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questionChanges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    completed: { type: Boolean, default: false },
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);
