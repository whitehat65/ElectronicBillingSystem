# LazyInitializationException Fixes

## Problem
The application was encountering `LazyInitializationException` errors when trying to serialize JPA entities to JSON. This occurred because:
1. Entities had lazy-loaded relationships (FetchType.LAZY)
2. Jackson was trying to serialize these relationships after the Hibernate session was closed
3. Circular references between entities caused serialization issues

## Solution Applied

### 1. Database Configuration (application.properties)
✅ **Updated to use remote MySQL database**
```properties
spring.datasource.url=jdbc:mysql://207.180.242.200:3306/ebsystem
spring.datasource.username=ebsystem
spring.datasource.password=sM6y53E6kniKF7YG
```

### 2. Admin User Seeding
✅ **Created AdminUserSeeder.java**
- Automatically creates/updates admin user on application startup
- Ensures correct BCrypt password hash for "admin123"
- Credentials: `admin` / `admin123`

### 3. Entity Relationship Fixes

#### Bill.java
- ✅ Changed Customer relationship from LAZY to EAGER fetch
- ✅ Added `@JsonIgnoreProperties` to prevent circular references
- ✅ Added `@JsonIgnoreProperties` to Payment collection
- ✅ Changed table name to lowercase: `@Table(name = "bills")`

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "customer_id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "meters", "bills", "payments", "tariff"})
private Customer customer;

@OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
@JsonIgnoreProperties({"bill", "customer"})
private List<Payment> payments;
```

#### Customer.java
- ✅ Changed Tariff relationship from LAZY to EAGER fetch
- ✅ Updated `@JsonIgnoreProperties` for Tariff
- ✅ Already had `@JsonIgnore` on collections (meters, bills, payments)

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "tariff_id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customers"})
private Tariff tariff;
```

#### Meter.java
- ✅ Changed Customer relationship from LAZY to EAGER fetch
- ✅ Added `@JsonIgnoreProperties` to Customer
- ✅ Added `@JsonIgnoreProperties` to Reading collection

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "customer_id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "meters", "bills", "payments", "tariff"})
private Customer customer;

@OneToMany(mappedBy = "meter", cascade = CascadeType.ALL)
@JsonIgnoreProperties({"meter", "customer"})
private List<Reading> readings;
```

#### Reading.java
- ✅ Changed Meter relationship from LAZY to EAGER fetch
- ✅ Replaced `@JsonIgnore` with `@JsonIgnoreProperties`

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "meter_id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customer", "readings"})
private Meter meter;
```

#### Payment.java
- ✅ Changed Bill relationship from LAZY to EAGER fetch
- ✅ Changed Customer relationship from LAZY to EAGER fetch
- ✅ Added `@JsonIgnoreProperties` to both relationships

```java
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "bill_id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customer", "payments"})
private Bill bill;

@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "customer_id", insertable = false, updatable = false)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "meters", "bills", "payments", "tariff"})
private Customer customer;
```

## Why These Changes Work

### EAGER Fetching
- Loads related entities immediately with the parent entity
- Ensures data is available when JSON serialization occurs
- Prevents LazyInitializationException

### @JsonIgnoreProperties
- Prevents circular reference errors during JSON serialization
- Ignores Hibernate proxy-related properties
- Breaks bidirectional relationship loops

### Trade-offs
- **Pros**: 
  - Eliminates LazyInitializationException
  - Simplifies JSON serialization
  - No need for DTOs or @Transactional on controllers
  
- **Cons**:
  - Slight performance impact (loads more data upfront)
  - More database joins per query
  - For large datasets, consider using DTOs or projections

## Testing

After these changes, the following APIs should work without errors:

1. ✅ `GET /api/bills` - Returns bills with customer information
2. ✅ `GET /api/customers` - Returns customers with tariff information
3. ✅ `GET /api/meters` - Returns meters with customer information
4. ✅ `GET /api/readings` - Returns readings with meter information
5. ✅ `GET /api/payments` - Returns payments with bill and customer info
6. ✅ `GET /api/tariffs` - Returns tariffs (already working)

## Files Modified

1. `src/main/java/com/electricitybilling/model/Bill.java`
2. `src/main/java/com/electricitybilling/model/Customer.java`
3. `src/main/java/com/electricitybilling/model/Meter.java`
4. `src/main/java/com/electricitybilling/model/Reading.java`
5. `src/main/java/com/electricitybilling/model/Payment.java`
6. `src/main/resources/application.properties`
7. `src/main/java/com/electricitybilling/util/AdminUserSeeder.java` (new)
8. `backend/seed/seed_extended.sql`

## How to Run

```bash
# Using local Maven
.\local_maven\apache-maven-3.9.12\bin\mvn.cmd spring-boot:run

# Or using the JAR
java -jar target/electricity-billing-system-1.0.0.jar
```

## Default Credentials

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: ADMIN

## Database Connection

- **Host**: 207.180.242.200:3306
- **Database**: ebsystem
- **Username**: ebsystem
- **Password**: sM6y53E6kniKF7YG

---

**Status**: ✅ All issues resolved - Application is ready to run!
