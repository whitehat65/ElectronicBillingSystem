require('dotenv').config();
const bcrypt = require('bcrypt');
const { User, sequelize } = require('./src/models');

async function updateAdminPassword() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected\n');

    // Generate proper password hash
    const password = 'admin123';
    const password_hash = await bcrypt.hash(password, 10);
    
    console.log('Updating admin user password...');
    
    // Update the existing admin user
    const [updated] = await User.update(
      { 
        password_hash,
        full_name: 'System Administrator',
        email: 'admin@ebsystem.com'
      },
      { where: { username: 'admin' } }
    );

    if (updated > 0) {
      console.log('✓ Admin password updated successfully!\n');
    } else {
      console.log('⚠ Admin user not found, creating new one...\n');
      
      await User.create({
        username: 'admin',
        password_hash,
        full_name: 'System Administrator',
        role: 'ADMIN',
        email: 'admin@ebsystem.com'
      });
      
      console.log('✓ Admin user created successfully!\n');
    }

    console.log('========================================');
    console.log('Login Credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateAdminPassword();
