require('dotenv').config();
const db = require('../models');
const Student = db.Student;
// Optional: if you have separate Admin or Teacher models, require them too:
// const Admin = db.Admin;
// const Teacher = db.Teacher;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// REGISTER — Create new student account
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, grade } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hash,
      role,
      grade: grade || 'N/A',
    });

    res.status(201).json({ message: 'Student registered!', user: student });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(400).json({ error: 'Registration failed' });
  }
};

// LOGIN — Authenticate and return JWT token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt:', email);

    // Lookup user
    const user = await Student.findOne({ where: { email } });

    if (!user) {
      console.log('🚫 User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    console.log('✅ Login success for:', user.email, '| role:', user.role);
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ error: 'Login error' });
  }
};
