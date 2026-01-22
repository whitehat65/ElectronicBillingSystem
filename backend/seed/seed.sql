-- Sample seed data for ebsystem
USE ebsystem;

INSERT INTO Users (username, password_hash, full_name, role, email) VALUES
('admin', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'System Admin', 'ADMIN', 'admin@example.com');

INSERT INTO Tariffs (name, description, tariff_json, fixed_charge) VALUES
('Domestic', 'Domestic consumer slabs', '{"slabs":[{"upto":100,"rate":1.5},{"upto":300,"rate":3.0},{"upto":null,"rate":5.0}], "tax_percent":5}', 30.00);

INSERT INTO Customers (customer_code, name, address, connection_no, tariff_id, status, contact_phone, contact_email) VALUES
('CUST001', 'Mahesh Kumar', '123 Main St, Pune', 'CONN001', 1, 'ACTIVE', '9876543210', 'mahesh@example.com');

INSERT INTO Meters (customer_id, meter_no, install_date, meter_type, multiplier) VALUES
(1, 'MTR1001', '2020-01-10', 'Single Phase', 1.0);

INSERT INTO Readings (meter_id, reading_date, reading_value) VALUES
(1, '2026-01-01', 1200.000),
(1, '2026-02-01', 1350.000);

-- Generate a basic bill for sample customer
INSERT INTO Bills (customer_id, period_start, period_end, units_consumed, energy_charge, fixed_charge, tax_amount, other_charges, total_amount, due_date, status) VALUES
(1, '2026-01-01', '2026-01-31', 150.000, 450.00, 30.00, 22.50, 0.00, 502.50, '2026-02-15', 'GENERATED');

INSERT INTO Payments (bill_id, customer_id, payment_date, amount, mode, reference) VALUES
(1, 1, '2026-02-10', 502.50, 'ONLINE', 'TXN123456');
