-- Database schema for ElectricityBillingSystem (MySQL)

CREATE DATABASE IF NOT EXISTS ebsystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ebsystem;

-- Customers table
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    connection_no VARCHAR(64),
    tariff_id INT NOT NULL,
    status ENUM('ACTIVE','SUSPENDED','DISCONNECTED') DEFAULT 'ACTIVE',
    contact_phone VARCHAR(32),
    contact_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meters table
CREATE TABLE IF NOT EXISTS Meters (
    meter_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    meter_no VARCHAR(64) NOT NULL UNIQUE,
    install_date DATE,
    meter_type VARCHAR(64),
    multiplier DECIMAL(10,4) DEFAULT 1.0,
    status ENUM('INSTALLED','REPLACED','REMOVED') DEFAULT 'INSTALLED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE SET NULL
);

-- Tariffs table (simple slab definitions stored as JSON)
CREATE TABLE IF NOT EXISTS Tariffs (
    tariff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    tariff_json JSON NOT NULL,
    fixed_charge DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Readings table
CREATE TABLE IF NOT EXISTS Readings (
    reading_id INT AUTO_INCREMENT PRIMARY KEY,
    meter_id INT NOT NULL,
    reading_date DATE NOT NULL,
    reading_value DECIMAL(14,3) NOT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY meter_date_unique (meter_id, reading_date),
    FOREIGN KEY (meter_id) REFERENCES Meters(meter_id) ON DELETE CASCADE
);

-- Bills table
CREATE TABLE IF NOT EXISTS Bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    units_consumed DECIMAL(14,3) DEFAULT 0.000,
    energy_charge DECIMAL(12,2) DEFAULT 0.00,
    fixed_charge DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    other_charges DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(14,2) DEFAULT 0.00,
    due_date DATE,
    status ENUM('GENERATED','SENT','PAID','PARTIALLY_PAID','OVERDUE','CANCELLED') DEFAULT 'GENERATED',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT,
    customer_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    mode ENUM('CASH','CHEQUE','ONLINE','CARD','OTHER') DEFAULT 'CASH',
    reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bill_id) REFERENCES Bills(bill_id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('ADMIN','BILLING','VIEWER') DEFAULT 'VIEWER',
    email VARCHAR(255),
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE IF NOT EXISTS AuditLogs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Indexes to improve query performance
CREATE INDEX idx_customers_tariff ON Customers(tariff_id);
CREATE INDEX idx_bills_customer ON Bills(customer_id);
CREATE INDEX idx_readings_meter_date ON Readings(meter_id, reading_date);

-- Sample tariff JSON example
-- INSERT INTO Tariffs (name, description, tariff_json, fixed_charge) VALUES (
--   'Domestic', 'Domestic consumer slabs',
--   '{"slabs": [{"upto":100, "rate":1.5}, {"upto":300, "rate":3.0}, {"upto":null, "rate":5.0}], "tax_percent": 5}',
--   30.00
-- );
