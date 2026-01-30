# Database Configuration Guide

## Current Configuration

The application is configured to use a **remote MySQL database** at:
- **Host**: `207.180.242.200:3306`
- **Database**: `ebsystem`
- **Username**: `ebsystem`
- **Password**: `sM6y53E6kniKF7YG`

## If You Need to Change the IP Address

Edit `src/main/resources/application.properties` and update the `spring.datasource.url` line:

### Common IP Patterns Ending in .200:
```properties
# Remote server (current configuration)
spring.datasource.url=jdbc:mysql://207.180.242.200:3306/ebsystem?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Or Local network 192.168.x.200 (if you have a local setup)
spring.datasource.url=jdbc:mysql://192.168.1.200:3306/ebsystem?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Or 192.168.0.200
spring.datasource.url=jdbc:mysql://192.168.0.200:3306/ebsystem?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true

# Or 10.0.0.200
spring.datasource.url=jdbc:mysql://10.0.0.200:3306/ebsystem?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

## Troubleshooting Connection Issues

### 1. Verify Database Server is Accessible
```bash
# Ping the server
ping 207.180.242.200

# Test MySQL port (Windows PowerShell)
Test-NetConnection -ComputerName 207.180.242.200 -Port 3306

# Or use telnet
telnet 207.180.242.200 3306
```

### 2. Check MySQL User Permissions
The remote MySQL server must allow connections from your IP address:

```sql
-- On the MySQL server (192.168.1.200)
CREATE USER 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON ebsystem.* TO 'root'@'%';
FLUSH PRIVILEGES;
```

### 3. Check MySQL Server Configuration
Ensure MySQL is listening on all interfaces (not just localhost):

Edit MySQL config file (`my.cnf` or `my.ini`):
```ini
[mysqld]
bind-address = 0.0.0.0
```

### 4. Firewall Rules
Ensure port 3306 is open on the remote server:

**Windows:**
```powershell
New-NetFirewallRule -DisplayName "MySQL" -Direction Inbound -Protocol TCP -LocalPort 3306 -Action Allow
```

**Linux:**
```bash
sudo ufw allow 3306/tcp
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

## Switch Between Local and Remote Database

### Use Local H2 Database (In-Memory)
Set active profile to `local`:

**Option 1**: Edit `application.properties`:
```properties
spring.profiles.active=local
```

**Option 2**: Run with profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Use Remote MySQL (Default)
Remove or comment out `spring.profiles.active` in `application.properties`

## Current Issues Resolved

✅ **Fixed**: Changed from `localhost:3306` to `207.180.242.200:3306`
✅ **Added**: `allowPublicKeyRetrieval=true` for MySQL 8.0+ compatibility
✅ **Set**: Correct credentials for remote database server

## What to Do Next

1. **Configuration is complete** - Database is set to `207.180.242.200:3306`
2. **Credentials are configured** - Username: `ebsystem`, Password: `sM6y53E6kniKF7YG`
3. **Test the connection** - Use the troubleshooting steps above if needed
4. **Rebuild and run** the application:
   ```bash
   mvn clean package
   mvn spring-boot:run
   ```

## Connection String Parameters Explained

- `createDatabaseIfNotExist=true` - Auto-creates the database if it doesn't exist
- `useSSL=false` - Disables SSL (suitable for local networks)
- `serverTimezone=UTC` - Sets the timezone for date/time operations
- `allowPublicKeyRetrieval=true` - Required for MySQL 8.0+ authentication

## Default Admin Credentials

After successful database connection:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `ADMIN`
