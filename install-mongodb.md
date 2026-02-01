# MongoDB Installation Guide for Windows

## Option 1: Install MongoDB Community Edition (Recommended)

### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0.x (Current)
   - Platform: Windows
   - Package: msi
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded .msi file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Complete the installation

### Step 3: Verify Installation
Open Command Prompt and run:
```bash
mongod --version
```

### Step 4: Start MongoDB Service
MongoDB should start automatically as a service. If not:
```bash
net start MongoDB
```

### Step 5: Update Backend Configuration
In `backend/.env`, use:
```
MONGODB_URI=mongodb://localhost:27017/realestate
```

## Option 2: Use MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Sign up for free account
3. Create a new cluster (free tier)

### Step 2: Configure Database Access
1. Go to "Database Access" in Atlas
2. Add a new database user
3. Set username: `realestate`
4. Set password: `RealEstate2024`
5. Give "Read and write to any database" permissions

### Step 3: Configure Network Access
1. Go to "Network Access" in Atlas
2. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
3. Or add your current IP address

### Step 4: Get Connection String
1. Go to "Clusters" in Atlas
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with `RealEstate2024`

### Step 5: Update Backend Configuration
In `backend/.env`, use your Atlas connection string:
```
MONGODB_URI=mongodb+srv://realestate:RealEstate2024@cluster0.xxxxx.mongodb.net/realestate?retryWrites=true&w=majority
```

## Quick Start Commands

After MongoDB is set up:

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not done)
npm install

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

## Troubleshooting

### MongoDB Service Not Starting
```bash
# Stop the service
net stop MongoDB

# Start the service
net start MongoDB
```

### Connection Issues
1. Check if MongoDB service is running
2. Verify the connection string in `.env`
3. For Atlas: Check network access and database user permissions
4. Check firewall settings

### Port Issues
If port 27017 is in use:
```bash
# Check what's using the port
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Verification

Once connected, you should see in the backend console:
```
✅ MongoDB Connected: localhost (or your Atlas cluster)
🚀 Server running on port 5000
```

And the seeder should create:
- Admin user: admin@realestate.com / Admin@123
- Agent user: agent@realestate.com / Agent@123
- Regular user: user@realestate.com / User@123
- 6 sample properties with real images