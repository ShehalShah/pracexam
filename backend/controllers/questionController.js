const Question = require('../models/Question');

const multer = require('multer');

// Set up multer for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

exports.addQuestion = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error uploading file.');
    }

    const { questionNumber, questionText, courseName, courseId } = req.body;

    try {
      const questionData = {
        questionNumber,
        questionText,
        courseName,
        courseId,
      };

      let base64Image = ""

      if (req.file) {
        console.log(req.file);
        // Convert image buffer to Base64 string
        base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        questionData.image = base64Image;
        // console.log(base64Image);
        // const base64Image = req.file.buffer.toString('base64');
        questionData.image = base64Image;
        // console.log(req.file.mimetype);
        // console.log(base64Image);
      }

      const question = new Question(questionData);
      await question.save();
      res.json(question);
      // res.status(200).send(base64Image);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
};

exports.fetchByids = async (req, res) => {
  try {
    const { questionIds } = req.body;
    const questions = await Question.find({ _id: { $in: questionIds } });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();

    // Iterate over each question to check for and convert binary image data
    const questionsWithBase64Images = questions.map(question => {
      console.log("hi");
      // Clone the question object to avoid modifying the original document
      const questionClone = { ...question._doc };
      questionClone.image && console.log(questionClone.image);
      // Check if the question has an image and if the image data type is 'Buffer'
      if (questionClone.image) {
        
        // Convert the binary data back to a Base64 string
        const base64Image = questionClone.image.toString('base64');
        
        // Replace the binary data with the Base64 string in the cloned question object
        questionClone.image = base64Image;
      }

      return questionClone;
    });

    // Send the modified questions array in the response
    res.json(questionsWithBase64Images);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getQuestionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const questions = await Question.find({ courseId });
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// exports.updateQuestion = async (req, res) => {
//   const { questionNumber, questionText, courseName, courseId } = req.body;
//   const { id } = req.params;

//   try {
//     let question = await Question.findById(id);

//     if (!question) {
//       return res.status(404).json({ msg: 'Question not found' });
//     }

//     question = await Question.findByIdAndUpdate(
//       id,
//       { $set: { questionNumber, questionText, courseName, courseId } },
//       { new: true }
//     );

//     res.json(question);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }

    await Question.findByIdAndRemove(id);

    res.json({ msg: 'Question removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateQuestion = (req, res) => {
  // const { id } = req.params;

  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error uploading file.');
    }
    const { id,questionNumber, questionText, courseName, courseId } = req.body;
    console.log(req.body);

    try {
      let updateData = {
        questionNumber,
        questionText,
        courseName,
        courseId,
      };
      // console.log(updateData);

      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        updateData.image = base64Image;
      }

      const question = await Question.findByIdAndUpdate(id, { $set: updateData }, { new: true });
      if (!question) {
        return res.status(404).json({ msg: 'Question not found' });
      }

      res.json(question);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
};
