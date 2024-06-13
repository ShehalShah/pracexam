const csv = require('csv-parser');
const fs = require('fs');
const User = require('../models/User');
const Question = require('../models/Question');

exports.uploadStudents = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const users = results.map(row => ({
          userId: row.userId,
          username: row.username,
          password: row.password,
          role: 'student',
        }));
        await User.insertMany(users);
        res.json({ msg: 'Students uploaded successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });
};

exports.uploadQuestions = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const questions = results.map(row => ({
          questionText: row.questionText,
          courseName: row.courseName,
          courseId: row.courseId,
          uploadDate: new Date(row.uploadDate),
        }));
        await Question.insertMany(questions);
        res.json({ msg: 'Questions uploaded successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });
};
