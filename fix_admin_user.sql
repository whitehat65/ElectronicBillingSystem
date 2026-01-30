-- Quick fix script to ensure admin user exists with correct password
-- Database: ebsystem
-- Username: admin
-- Password: admin123
-- Run this on the remote database: 207.180.242.200

USE ebsystem;

-- Delete existing admin user if exists (to avoid conflicts)
DELETE FROM Users WHERE username = 'admin';

-- Insert admin user with correct BCrypt hash for 'admin123'
INSERT INTO Users (username, password_hash, full_name, role, email, created_at)
VALUES ('admin', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u',
        'System Administrator', 'ADMIN', 'admin@ebsystem.com', NOW());

-- Verify the user was created
SELECT user_id, username, full_name, role, email, created_at
FROM Users
WHERE username = 'admin';

-- Show login instructions
SELECT 'Admin user created successfully!' AS Status,
       'Username: admin' AS Username,
       'Password: admin123' AS Password;
