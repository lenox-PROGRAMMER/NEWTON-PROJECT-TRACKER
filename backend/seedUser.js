const bcrypt = require('bcrypt');
const { User } = require('./models'); // adjust if your User model is nested differently

(async () => {
  try {
    const hashedPassword = await bcrypt.hash('i love python 2024', 10);
    await User.create({
      name: 'Lenox',
      email: 'lenoxowino2022@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('✅ Admin user created successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding user:', err);
    process.exit(1);
  }
})();
