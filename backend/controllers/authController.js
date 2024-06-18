const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const config = require('config');
const { check, validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const { userId, username, password, role, sapId, rollNo, branch, className, batchName } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      userId,
      username,
      password,
      role,
      sapId,
      rollNo,
      branch,
      className,
      batchName,
    });

    await user.save();

    // const payload = {
    //   user: {
    //     id: user.id,
    //     role: user.role,
    //   },
    // };

    const payload = {
        user: {
          id: user.id,
          role: user.role,
         ...(user.batchName && { batchName: user.batchName }),
        },
      };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ user, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // const payload = {
    //   user: {
    //     id: user.id,
    //     role: user.role,
    //   },
    // };

    const payload = {
        user: {
          id: user.id,
          role: user.role,
         ...(user.batchName && { batchName: user.batchName }),
        },
      };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ user, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
