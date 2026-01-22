# How to Run the Java Maven Project

## Step 1: Ensure Prerequisites are Installed
- Java 17 or higher: `java -version`
- Maven 3.6+: `mvn -version`
- MySQL 8.0+: Verify MySQL service is running

## Step 2: Database Setup

### Create Database
```sql
CREATE DATABASE ElectricityBillingSystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Update Database Credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### Initialize Database (Optional - for sample data)
```bash
mysql -u root -p ElectricityBillingSystem < src/main/resources/db/init.sql
```

## Step 3: Build and Run

### Option A: Using Maven (Development Mode)
```bash
# From project root directory
mvn spring-boot:run
```

### Option B: Build JAR and Run
```bash
# Build
mvn clean package

# Run
java -jar target/electricity-billing-system-1.0.0.jar
```

### Option C: Using IDE
1. Import project as Maven project in IntelliJ IDEA or Eclipse
2. Run `ElectricityBillingApplication.java` main class

## Step 4: Access Application

Open browser and navigate to:
- **Application:** http://localhost:8080/
- **Login:** admin / admin123

## Step 5: First Time Setup (if not using init.sql)

### Create Admin User Manually
The application will create tables automatically. To create admin user:

```sql
USE ElectricityBillingSystem;

INSERT INTO Users (username, password_hash, full_name, role, email, created_at) 
VALUES ('admin', '$2a$10$8X9YqXh4N5gB4J8xQj8Z3.CqZqVxZtPp6Yh5b2vP9wZzF7yK3yY8u', 
        'Admin', 'ADMIN', 'admin@test.com', NOW());
```

Password hash is for 'admin123'

## Troubleshooting

### Port 8080 in Use
Change port in `application.properties`:
```properties
server.port=8081
```

### Cannot Connect to Database
- Check MySQL is running
- Verify credentials in application.properties
- Ensure database exists

### Build Fails
```bash
mvn clean install -U -DskipTests
```

---

## Development Tips

### Hot Reload (Dev Tools)
The application includes Spring DevTools for automatic restart on code changes.

### View SQL Queries
Check console output - SQL logging is enabled in development.

### API Testing
Use Postman or curl to test API endpoints directly:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
