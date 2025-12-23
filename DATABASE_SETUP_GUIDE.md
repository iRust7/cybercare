# 🗄️ Database Setup Guide - CyberCare UMKM

## ⚠️ PROBLEM
You're getting this error:
```
Error 1146 (42S02): Table 'cybercare_db.user_gamifications' doesn't exist
```

This means the database tables haven't been created yet.

---

## ✅ SOLUTION - Setup Database

### Option 1: Using MySQL Command Line (Recommended)

1. **Open PowerShell/Command Prompt**

2. **Navigate to backend folder:**
```powershell
cd "C:\Users\rhiza\Desktop\cybercare umkm\backend"
```

3. **Run MySQL and execute the setup script:**
```powershell
mysql -u root -p < SETUP_DATABASE_FIXED.sql
```

4. **Enter your MySQL password when prompted**

---

### Option 2: Using phpMyAdmin

1. **Open phpMyAdmin** in your browser
   - Usually: http://localhost/phpmyadmin

2. **Click on "SQL" tab** at the top

3. **Open the file** `backend/SETUP_DATABASE_FIXED.sql` in a text editor

4. **Copy ALL the content** (Ctrl+A, Ctrl+C)

5. **Paste into phpMyAdmin SQL box**

6. **Click "Go"** button at the bottom

7. **Wait for success message**

---

### Option 3: Using MySQL Workbench

1. **Open MySQL Workbench**

2. **Connect to your local MySQL server**

3. **File → Open SQL Script**

4. **Navigate to:** `C:\Users\rhiza\Desktop\cybercare umkm\backend\SETUP_DATABASE_FIXED.sql`

5. **Click the lightning bolt** icon to execute

---

## 🔍 Verify Setup

After running the script, verify the tables were created:

### In MySQL Command Line:
```sql
USE cybercare_db;
SHOW TABLES;
```

You should see:
```
+---------------------------+
| Tables_in_cybercare_db    |
+---------------------------+
| badges                    |
| materials                 |
| quiz_results              |
| quizzes                   |
| user_badges               |
| user_gamifications        |
| user_materials            |
| users                     |
+---------------------------+
```

### Check Demo Users:
```sql
SELECT id, name, email, role FROM users;
```

You should see:
```
+----+------------------+------------------------+-------+
| id | name             | email                  | role  |
+----+------------------+------------------------+-------+
|  1 | Budi Santoso     | budi@example.com       | user  |
|  2 | Admin CyberCare  | admin@cybercare.com    | admin |
+----+------------------+------------------------+-------+
```

---

## 🔐 Login Credentials

After setup, you can login with:

### User Account:
- **Email:** budi@example.com
- **Password:** password123

### Admin Account:
- **Email:** admin@cybercare.com
- **Password:** admin123

---

## 🚀 Start the Backend Server

After database setup is complete:

1. **Navigate to backend folder:**
```powershell
cd "C:\Users\rhiza\Desktop\cybercare umkm\backend"
```

2. **Start the Go server:**
```powershell
go run main.go
```

You should see:
```
Server starting on :8080
```

---

## 🧪 Test Everything

1. **Backend is running** → http://localhost:8080
2. **Open frontend** → Open `frontend/login.html` in browser
3. **Login** with budi@example.com / password123
4. **Dashboard should load** without errors!

---

## ❓ Troubleshooting

### Problem: "Access denied for user 'root'@'localhost'"
**Solution:** Check your MySQL password or user credentials in `backend/config/database.go`

### Problem: "Database cybercare_db doesn't exist"
**Solution:** The script creates it automatically. Make sure you have permissions to create databases.

### Problem: "Can't connect to MySQL server"
**Solution:** Make sure MySQL service is running:
```powershell
# Check MySQL status
net start | findstr MySQL

# Start MySQL if not running
net start MySQL80  # or your MySQL service name
```

### Problem: Still getting table errors
**Solution:** Drop and recreate:
```sql
DROP DATABASE IF EXISTS cybercare_db;
```
Then run the setup script again.

---

## 📝 What the Script Does

1. ✅ Drops existing `cybercare_db` (if exists)
2. ✅ Creates new `cybercare_db` database
3. ✅ Creates all 8 required tables with proper relationships
4. ✅ Inserts 2 demo users (budi & admin)
5. ✅ Inserts 7 achievement badges
6. ✅ Inserts 5 learning materials
7. ✅ Initializes gamification data for demo users

---

## 🎯 Next Steps

After successful database setup:

1. ✅ Start backend: `go run main.go`
2. ✅ Open frontend: `frontend/login.html`
3. ✅ Login and test dashboard
4. ✅ All features should work now!

---

**Need help?** Check the console logs in both backend and browser for detailed error messages.
