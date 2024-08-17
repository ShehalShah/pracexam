const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');

exports.uploadStudents = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const users = await Promise.all(results.map(async (row) => {
        //   const password = Math.random().toString(36).slice(-8);
        //   const hashedPassword = await bcrypt.hash(password, 10);
        const password = `${row.username}@${row.sapId}`;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // const hashedPassword = await bcrypt.hash(password, 10);
          return {
            userId: row.userId,
            username: row.username,
            password: hashedPassword,
            role: 'student',
            sapId: row.sapId,
            rollNo: row.rollNo,
            branch: row.branch,
            className: row.className,
            batchName: row.batchName,
          };
        }));
        await User.insertMany(users);
        // res.json({ msg: 'Students uploaded successfully' });
        const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
        res.json({ msg: 'Students uploaded successfully', users: usersWithoutPassword });
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
          questionNumber: row.questionNumber,
          questionText: row.questionText,
          courseName: row.courseName,
          courseId: row.courseId,
        }));
        await Question.insertMany(questions);
        // res.json({ msg: 'Questions uploaded successfully' });
        res.json({ msg: 'Questions uploaded successfully', questions });

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });
};
