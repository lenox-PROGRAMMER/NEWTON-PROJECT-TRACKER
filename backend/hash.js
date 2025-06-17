const bcrypt = require('bcrypt');

bcrypt.hash('i love python 2024', 10).then(hash => {
  console.log('Hashed password:', hash);
});
