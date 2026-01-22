const bcrypt = require('bcrypt');

// Script to generate password hash for seed data
// Run: node generate_hash.js

const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in your seed.sql file for the Users table.');
});
