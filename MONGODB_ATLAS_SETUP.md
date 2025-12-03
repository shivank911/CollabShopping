# MongoDB Atlas Setup Guide

## Step-by-Step Guide to Connect MongoDB Atlas

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (if you don't have one)
3. Click "Build a Database"
4. Choose **FREE** tier (M0 Sandbox)
5. Select your preferred cloud provider and region
6. Click "Create Cluster"

### 2. Create Database User

1. In the left sidebar, click **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Set username and password (save these securely!)
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

### 3. Whitelist Your IP Address

1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Either:
   - Click **Add Current IP Address** (for development)
   - Or click **Allow Access from Anywhere** (0.0.0.0/0) - for testing only
4. Click **Confirm**

### 4. Get Connection String

1. Go back to **Database** in the left sidebar
2. Click **Connect** button on your cluster
3. Select **Connect your application**
4. Choose **Driver**: Node.js
5. Choose **Version**: 4.1 or later
6. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 5. Configure Your Application

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Atlas Connection String
# Replace <username> with your database username
# Replace <password> with your database password
# Add your database name after .net/
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/collaborative-shopping?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-long-random-string
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,exp://localhost:19000,http://localhost:19006
```

### 6. Important Notes

**Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@CLUSTER-URL/DATABASE-NAME?retryWrites=true&w=majority
```

**Example (with actual values):**
```
mongodb+srv://myuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/collaborative-shopping?retryWrites=true&w=majority
```

**Key Points:**
- Replace `<username>` with your database username
- Replace `<password>` with your database password (URL-encode special characters)
- Replace `cluster0.xxxxx` with your actual cluster URL
- Add database name: `collaborative-shopping` (or your preferred name)
- Keep `?retryWrites=true&w=majority` at the end

### 7. Special Characters in Password

If your password contains special characters, you need to URL-encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| :         | %3A     |
| /         | %2F     |
| ?         | %3F     |
| #         | %23     |
| [         | %5B     |
| ]         | %5D     |
| =         | %3D     |
| &         | %26     |

**Example:**
- Password: `P@ssw0rd!`
- Encoded: `P%40ssw0rd!`

### 8. Test Connection

1. Make sure you have the `.env` file configured
2. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```
3. You should see: `✅ Connected to MongoDB`

### 9. Troubleshooting

**"MongooseServerSelectionError":**
- Check if your IP address is whitelisted
- Verify username and password are correct
- Ensure password special characters are URL-encoded

**"Authentication failed":**
- Double-check username and password
- Make sure user has proper permissions

**"Connection timeout":**
- Check your internet connection
- Verify firewall isn't blocking MongoDB ports
- Try whitelisting 0.0.0.0/0 temporarily

### 10. Security Best Practices

✅ **DO:**
- Use strong, unique passwords
- Add `.env` to `.gitignore` (already done)
- Use environment variables for sensitive data
- Restrict IP addresses in production
- Create separate database users for different environments

❌ **DON'T:**
- Commit `.env` file to Git
- Use simple passwords like "password123"
- Allow access from anywhere (0.0.0.0/0) in production
- Share your connection string publicly
- Use the same credentials across environments

### 11. Environment-Specific Configuration

**Development:**
```env
MONGODB_URI=mongodb+srv://dev-user:dev-pass@cluster0.xxxxx.mongodb.net/csg-dev?retryWrites=true&w=majority
```

**Production:**
```env
MONGODB_URI=mongodb+srv://prod-user:prod-pass@cluster0.xxxxx.mongodb.net/csg-prod?retryWrites=true&w=majority
```

## Quick Setup Checklist

- [ ] Create MongoDB Atlas account
- [ ] Create a free cluster
- [ ] Create database user with username and password
- [ ] Whitelist your IP address
- [ ] Get connection string
- [ ] Create `.env` file in `backend/` directory
- [ ] Update `MONGODB_URI` with your connection string
- [ ] Replace `<username>` and `<password>` with actual values
- [ ] Add database name to connection string
- [ ] Test connection by running `npm run dev`
- [ ] Verify "✅ Connected to MongoDB" message appears

## Need Help?

If you encounter issues:
1. Check MongoDB Atlas dashboard for cluster status
2. Verify network access settings
3. Test connection using MongoDB Compass
4. Check server logs for detailed error messages

---

**Your connection string should look like this:**
```
mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/collaborative-shopping?retryWrites=true&w=majority
```

Replace the parts as needed and save in your `.env` file!
