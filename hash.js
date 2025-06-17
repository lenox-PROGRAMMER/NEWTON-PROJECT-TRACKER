const bcrypt = require('bcrypt');

bcrypt.hash('lenox123', 10)
  .then(hash => {
    console.log('💾 Your hashed password:\n', hash);
  })
  .catch(err => {
    console.error('❌ Error hashing password:', err);
  });
