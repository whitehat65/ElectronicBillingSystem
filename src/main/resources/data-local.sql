-- H2 data file for local profile: insert admin user
-- This is loaded for the 'local' profile using Spring Boot's data locations when active

INSERT INTO users (username, password_hash, full_name, role, email, created_at)
VALUES ('admin', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u', 'System Administrator', 'ADMIN', 'admin@electricitybilling.com', CURRENT_TIMESTAMP);
