# ⚡ Electricity Billing System - Java Maven Project

A complete web-based Electricity Billing System built with **Java Spring Boot** (Maven) for backend and **HTML/CSS/JavaScript** for frontend.

## 🏗️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** (Hibernate)
- **Spring Security** (BCrypt password hashing)
- **MySQL Database**
- **Maven** (Build tool)

### Frontend
- **HTML5**
- **CSS3** (Responsive design)
- **Vanilla JavaScript** (ES6+)
- **Fetch API** for REST calls

## 📋 Features

✅ Customer Management  
✅ Meter Management  
✅ Tariff Configuration (Slab-based billing)  
✅ Meter Reading Recording  
✅ Automated Bill Generation  
✅ Payment Processing  
✅ Dashboard with Statistics  
✅ User Authentication & Authorization  
✅ Audit Logging  

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ElectronicBillingSystem
```

### 2. Database Setup
Create MySQL database and user:
```sql
CREATE DATABASE ElectricityBillingSystem CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ElectricityBillingSystem
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Initialize Database with Sample Data
Run the initialization script:
```bash
mysql -u root -p ElectricityBillingSystem < src/main/resources/db/init.sql
```

### 4. Build the Project
```bash
mvn clean install
```

### 5. Run the Application
```bash
mvn spring-boot:run
```

Or run the JAR file:
```bash
java -jar target/electricity-billing-system-1.0.0.jar
```

### 6. Access the Application
- **Frontend:** http://localhost:8080/
- **API Base URL:** http://localhost:8080/api

## 🔑 Default Login Credentials

- **Username:** admin
- **Password:** admin123

## 📁 Project Structure

```
ElectronicBillingSystem/
├── pom.xml                                 # Maven configuration
├── src/
│   ├── main/
│   │   ├── java/com/electricitybilling/
│   │   │   ├── ElectricityBillingApplication.java    # Main application
│   │   │   ├── model/                               # JPA Entities
│   │   │   │   ├── Customer.java
│   │   │   │   ├── Meter.java
│   │   │   │   ├── Tariff.java
│   │   │   │   ├── Reading.java
│   │   │   │   ├── Bill.java
│   │   │   │   ├── Payment.java
│   │   │   │   ├── User.java
│   │   │   │   └── AuditLog.java
│   │   │   ├── repository/                          # Data Access Layer
│   │   │   │   ├── CustomerRepository.java
│   │   │   │   ├── MeterRepository.java
│   │   │   │   └── ...
│   │   │   ├── service/                             # Business Logic Layer
│   │   │   │   ├── CustomerService.java
│   │   │   │   ├── BillService.java
│   │   │   │   ├── PaymentService.java
│   │   │   │   └── AuthService.java
│   │   │   ├── controller/                          # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── CustomerController.java
│   │   │   │   ├── BillController.java
│   │   │   │   └── ...
│   │   │   ├── dto/                                 # Data Transfer Objects
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   └── ...
│   │   │   └── config/                              # Configuration
│   │   │       ├── SecurityConfig.java
│   │   │       └── WebConfig.java
│   │   └── resources/
│   │       ├── application.properties               # App configuration
│   │       ├── db/
│   │       │   └── init.sql                        # Database initialization
│   │       └── static/                             # Frontend files
│   │           ├── index.html                      # Login page
│   │           ├── dashboard.html
│   │           ├── customers.html
│   │           ├── bills.html
│   │           ├── payments.html
│   │           ├── css/
│   │           │   └── styles.css
│   │           └── js/
│   │               ├── api.js
│   │               ├── auth.js
│   │               ├── dashboard.js
│   │               └── ...
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Meters
- `GET /api/meters` - Get all meters
- `POST /api/meters` - Create new meter
- `PUT /api/meters/{id}` - Update meter

### Tariffs
- `GET /api/tariffs` - Get all tariffs
- `POST /api/tariffs` - Create new tariff
- `PUT /api/tariffs/{id}` - Update tariff

### Readings
- `GET /api/readings` - Get all readings
- `POST /api/readings` - Record new reading

### Bills
- `GET /api/bills` - Get all bills
- `GET /api/bills/{id}` - Get bill by ID
- `POST /api/bills/generate` - Generate new bill

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Record new payment

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics

## 💻 Development Commands

### Build without tests
```bash
mvn clean package -DskipTests
```

### Run tests
```bash
mvn test
```

### Clean build
```bash
mvn clean
```

### Create JAR
```bash
mvn package
```

## 📊 Database Schema

The system uses 8 main tables:
- **Customers** - Customer information
- **Meters** - Meter details linked to customers
- **Tariffs** - Billing tariff configurations
- **Readings** - Meter reading records
- **Bills** - Generated bills
- **Payments** - Payment records
- **Users** - System users
- **AuditLogs** - Activity audit trail

## 🎨 Frontend Pages

1. **index.html** - Login page
2. **dashboard.html** - Main dashboard with statistics
3. **customers.html** - Customer management
4. **meters.html** - Meter management
5. **tariffs.html** - Tariff configuration
6. **readings.html** - Meter reading entry
7. **bills.html** - Bill generation and listing
8. **payments.html** - Payment recording

## 🔐 Security Features

- BCrypt password hashing
- Session-based authentication
- CORS configuration
- SQL injection prevention (JPA/Hibernate)
- Input validation

## 📝 Configuration

Key configuration in `application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ElectricityBillingSystem
spring.datasource.username=root
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT (optional)
jwt.secret=your-secret-key
jwt.expiration=86400000
```

## 🐛 Troubleshooting

### Port Already in Use
If port 8080 is occupied, change it in `application.properties`:
```properties
server.port=8081
```

### Database Connection Error
- Verify MySQL is running: `systemctl status mysql` (Linux) or check services (Windows)
- Check credentials in application.properties
- Ensure database exists

### Build Errors
```bash
mvn clean install -U
```

## 📄 License

This project is for educational purposes.

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using Java Spring Boot and Vanilla JavaScript**
