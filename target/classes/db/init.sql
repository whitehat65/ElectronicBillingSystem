-- Database initialization script for Electricity Billing System
-- Run this script to create tables and insert sample data

USE ElectricityBillingSystem;

-- Create Users table and insert admin user
-- Password for 'admin' is 'admin123' (BCrypt hashed)
INSERT INTO Users (username, password_hash, full_name, role, email, created_at) 
VALUES ('admin', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u', 'System Administrator', 'ADMIN', 'admin@electricitybilling.com', NOW())
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample tariffs
INSERT INTO Tariffs (name, description, tariff_json, fixed_charge, created_at) VALUES
('Residential Basic', 'Basic residential tariff with progressive slabs', 
'{"slabs":[{"upto":100,"rate":2.5},{"upto":200,"rate":3.5},{"upto":300,"rate":4.5},{"rate":6.0}],"tax_percent":10}', 
50.00, NOW()),

('Commercial', 'Commercial and business establishments', 
'{"slabs":[{"upto":500,"rate":5.0},{"rate":7.5}],"tax_percent":15}', 
150.00, NOW()),

('Industrial', 'Industrial consumers', 
'{"slabs":[{"rate":6.5}],"tax_percent":18}', 
300.00, NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample customers
INSERT INTO Customers (customer_code, name, address, connection_no, tariff_id, status, contact_phone, contact_email, created_at) VALUES
('CUST00000001', 'John Doe', '123 Main Street, City Center', 'CONN-2024-001', 1, 'ACTIVE', '9876543210', 'john.doe@email.com', NOW()),
('CUST00000002', 'Jane Smith', '456 Park Avenue, Downtown', 'CONN-2024-002', 1, 'ACTIVE', '9876543211', 'jane.smith@email.com', NOW()),
('CUST00000003', 'ABC Enterprises', '789 Business District', 'CONN-2024-003', 2, 'ACTIVE', '9876543212', 'contact@abc.com', NOW())
ON DUPLICATE KEY UPDATE customer_code=customer_code;

-- Insert sample meters
INSERT INTO Meters (customer_id, meter_no, install_date, meter_type, multiplier, status, created_at) VALUES
(1, 'MTR-001-2024', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED', NOW()),
(2, 'MTR-002-2024', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED', NOW()),
(3, 'MTR-003-2024', '2024-01-01', 'Three Phase', 1.0000, 'INSTALLED', NOW())
ON DUPLICATE KEY UPDATE meter_no=meter_no;

-- Insert sample readings for January 2024
INSERT INTO Readings (meter_id, reading_date, reading_value, created_at) VALUES
-- Meter 1 readings
(1, '2024-01-01', 1000.000, NOW()),
(1, '2024-01-31', 1150.000, NOW()),

-- Meter 2 readings
(2, '2024-01-01', 2000.000, NOW()),
(2, '2024-01-31', 2250.000, NOW()),

-- Meter 3 readings
(3, '2024-01-01', 5000.000, NOW()),
(3, '2024-01-31', 5800.000, NOW())
ON DUPLICATE KEY UPDATE reading_id=reading_id;

-- Note: Bills and Payments can be generated through the application
-- The bill generation endpoint will calculate charges based on readings and tariffs

SELECT 'Database initialized successfully!' as Status;
SELECT 'Default login: username=admin, password=admin123' as Credentials;
