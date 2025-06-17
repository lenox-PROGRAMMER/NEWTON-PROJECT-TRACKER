const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Student } = require('../models'); 

// 🔐 Registration route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name, grade } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const newUser = await Student.create({
      name,
      email,
      password: hashed,
      role,
      grade: grade || 'N/A' // default if missing
    });

    res.status(201).json({ message: 'Registered', user: newUser });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// 🔐 Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    const student = await Student.findOne({ where: { email } });

    if (!student) {
      console.log('🚫 User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      console.log('🚫 Wrong password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        role: student.role,
        name: student.name
      },
      process.env.JWT_SECRET || 'supersecretkey', // Use .env ideally
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Something went wrong during login' });
  }
});

module.exports = router;
