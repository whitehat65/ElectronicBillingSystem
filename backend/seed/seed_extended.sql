-- Extended seed data for Electricity Billing System
USE ebsystem;

-- Clear existing data (optional - use with caution)
-- DELETE FROM Payments;
-- DELETE FROM Bills;
-- DELETE FROM Readings;
-- DELETE FROM Meters;
-- DELETE FROM Customers;
-- DELETE FROM Tariffs;
-- DELETE FROM AuditLogs;
-- DELETE FROM Users;

-- Insert Tariffs
INSERT INTO Tariffs (tariff_id, name, description, tariff_json, fixed_charge) VALUES
(1, 'Domestic', 'Residential consumers - Slab based pricing',
 '{"slabs": [{"upto":100, "rate":2.5}, {"upto":300, "rate":4.0}, {"upto":500, "rate":5.5}, {"upto":null, "rate":7.0}], "tax_percent": 5}',
 50.00),
(2, 'Commercial', 'Commercial establishments',
 '{"slabs": [{"upto":200, "rate":5.0}, {"upto":500, "rate":7.0}, {"upto":null, "rate":9.0}], "tax_percent": 10}',
 150.00),
(3, 'Industrial', 'Industrial consumers',
 '{"slabs": [{"upto":1000, "rate":6.0}, {"upto":null, "rate":8.0}], "tax_percent": 12}',
 500.00);

-- Insert Users (password: admin123 / billing123 / viewer123)
-- BCrypt hash for 'admin123': $2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u
INSERT INTO Users (username, password_hash, full_name, role, email) VALUES
('admin', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u', 'System Administrator', 'ADMIN', 'admin@ebsystem.com'),
('billing', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u', 'Billing Department', 'BILLING', 'billing@ebsystem.com'),
('viewer', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u', 'View Only User', 'VIEWER', 'viewer@ebsystem.com');

-- Insert Customers
INSERT INTO Customers (customer_code, name, address, connection_no, tariff_id, status, contact_phone, contact_email) VALUES
('CUST00001', 'Rajesh Kumar', '123 MG Road, Mumbai, Maharashtra 400001', 'CONN-2024-001', 1, 'ACTIVE', '+91-9876543210', 'rajesh.kumar@email.com'),
('CUST00002', 'Priya Sharma', '456 Park Street, Kolkata, West Bengal 700016', 'CONN-2024-002', 1, 'ACTIVE', '+91-9876543211', 'priya.sharma@email.com'),
('CUST00003', 'Amit Patel', '789 Brigade Road, Bangalore, Karnataka 560001', 'CONN-2024-003', 2, 'ACTIVE', '+91-9876543212', 'amit.patel@email.com'),
('CUST00004', 'Sneha Reddy', '321 Anna Salai, Chennai, Tamil Nadu 600002', 'CONN-2024-004', 1, 'ACTIVE', '+91-9876543213', 'sneha.reddy@email.com'),
('CUST00005', 'Vikram Industries', '555 Industrial Area, Pune, Maharashtra 411001', 'CONN-2024-005', 3, 'ACTIVE', '+91-9876543214', 'info@vikramindustries.com'),
('CUST00006', 'Lakshmi Nair', '678 Marine Drive, Kochi, Kerala 682011', 'CONN-2024-006', 1, 'ACTIVE', '+91-9876543215', 'lakshmi.nair@email.com'),
('CUST00007', 'Tech Solutions Pvt Ltd', '890 Cyber City, Hyderabad, Telangana 500081', 'CONN-2024-007', 2, 'ACTIVE', '+91-9876543216', 'contact@techsolutions.com'),
('CUST00008', 'Arjun Verma', '234 Civil Lines, Delhi 110054', 'CONN-2024-008', 1, 'ACTIVE', '+91-9876543217', 'arjun.verma@email.com');

-- Insert Meters
INSERT INTO Meters (customer_id, meter_no, install_date, meter_type, multiplier, status) VALUES
(1, 'MTR-2024-001', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED'),
(2, 'MTR-2024-002', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED'),
(3, 'MTR-2024-003', '2024-01-01', 'Three Phase', 1.0000, 'INSTALLED'),
(4, 'MTR-2024-004', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED'),
(5, 'MTR-2024-005', '2024-01-01', 'Three Phase HT', 10.0000, 'INSTALLED'),
(6, 'MTR-2024-006', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED'),
(7, 'MTR-2024-007', '2024-01-01', 'Three Phase', 1.0000, 'INSTALLED'),
(8, 'MTR-2024-008', '2024-01-01', 'Single Phase', 1.0000, 'INSTALLED');

-- Insert Readings for past 3 months
-- Customer 1 (Rajesh Kumar) - Domestic
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(1, '2023-10-01', 10000.000),
(1, '2023-11-01', 10180.000),
(1, '2023-12-01', 10350.000),
(1, '2024-01-01', 10550.000);

-- Customer 2 (Priya Sharma) - Domestic
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(2, '2023-10-01', 5000.000),
(2, '2023-11-01', 5120.000),
(2, '2023-12-01', 5250.000),
(2, '2024-01-01', 5380.000);

-- Customer 3 (Amit Patel) - Commercial
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(3, '2023-10-01', 20000.000),
(3, '2023-11-01', 20350.000),
(3, '2023-12-01', 20720.000),
(3, '2024-01-01', 21080.000);

-- Customer 4 (Sneha Reddy) - Domestic
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(4, '2023-10-01', 8000.000),
(4, '2023-11-01', 8145.000),
(4, '2023-12-01', 8290.000),
(4, '2024-01-01', 8440.000);

-- Customer 5 (Vikram Industries) - Industrial
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(5, '2023-10-01', 1000.000),
(5, '2023-11-01', 1250.000),
(5, '2023-12-01', 1480.000),
(5, '2024-01-01', 1720.000);

-- Customer 6 (Lakshmi Nair) - Domestic
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(6, '2023-10-01', 12000.000),
(6, '2023-11-01', 12160.000),
(6, '2023-12-01', 12310.000),
(6, '2024-01-01', 12470.000);

-- Customer 7 (Tech Solutions) - Commercial
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(7, '2023-10-01', 15000.000),
(7, '2023-11-01', 15280.000),
(7, '2023-12-01', 15570.000),
(7, '2024-01-01', 15840.000);

-- Customer 8 (Arjun Verma) - Domestic
INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(8, '2023-10-01', 6000.000),
(8, '2023-11-01', 6135.000),
(8, '2023-12-01', 6270.000),
(8, '2024-01-01', 6410.000);

-- Insert some sample audit logs
INSERT INTO AuditLogs (user_id, action, details) VALUES
(1, 'SYSTEM_START', 'System initialized with seed data'),
(1, 'TARIFF_CREATED', 'Created Domestic tariff'),
(1, 'TARIFF_CREATED', 'Created Commercial tariff'),
(1, 'TARIFF_CREATED', 'Created Industrial tariff');

SELECT 'Extended seed data inserted successfully!' as message;
