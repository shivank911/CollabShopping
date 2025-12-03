# Collaborative Shopping Group (CSG)

A full-stack collaborative shopping application that enables users to create groups, share shopping carts, and automate orders across multiple e-commerce platforms.

## 🎯 Problem Solved

Have you ever wanted to share a product you're browsing with friends for their opinion? Or coordinate group orders from various shopping apps? CSG solves this by allowing you to:

- **Create shopping groups** with friends and family
- **Share shopping carts** in real-time across all group members
- **Add products from any platform** (H&M, Myntra, Amazon, Flipkart, Blinkit, etc.)
- **Automate orders** across different e-commerce platforms
- **Track orders** collaboratively within your group

## 🏗️ Project Structure

```
CSG/
├── backend/          # Node.js + Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── server.ts
│   ├── package.json
│   └── README.md
│
├── mobile/           # React Native app (iOS & Android)
│   ├── app/         # Expo Router pages
│   ├── services/    # API clients
│   ├── context/     # State management
│   ├── package.json
│   └── README.md
│
├── shared/          # Shared types and utilities
│   └── types/       # TypeScript interfaces
│
└── README.md        # This file
```

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Web Scraping**: Axios + Cheerio
- **Language**: TypeScript

### Mobile
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router
- **State**: React Context API
- **API Client**: Axios
- **Real-time**: Socket.IO Client
- **Language**: TypeScript

## 📱 Features

### ✅ Implemented
- User registration and authentication
- Group creation and management
- Member invitation and management
- Shared shopping cart with real-time sync
- Product scraping from URLs
- Order creation and tracking
- Real-time updates via WebSocket
- Multi-platform support (Amazon, Flipkart, Myntra, H&M, Blinkit)

### 🚧 Coming Soon
- Automated order placement
- In-app chat for groups
- Push notifications
- Product recommendations
- Price tracking and alerts
- Payment integration
- Order history analytics

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or cloud)
- npm or yarn
- Expo CLI (for mobile)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update environment variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/collaborative-shopping
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

5. Start MongoDB:
```bash
mongod
```

6. Run the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Mobile Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://YOUR_IP:3000/api"
    }
  }
}
```

4. Start Expo:
```bash
npm start
```

5. Run on device/simulator:
```bash
# iOS
npm run ios

# Android
npm run android
```

## 📖 API Documentation

### Authentication
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
GET  /api/auth/me        - Get current user
```

### Groups
```
POST   /api/groups                      - Create group
GET    /api/groups                      - Get user's groups
GET    /api/groups/:id                  - Get group details
PUT    /api/groups/:id                  - Update group
DELETE /api/groups/:id                  - Delete group
POST   /api/groups/:id/members          - Add member
DELETE /api/groups/:id/members/:userId  - Remove member
```

### Cart
```
GET    /api/carts/:groupId                  - Get group cart
POST   /api/carts/:groupId/items            - Add item
PUT    /api/carts/:groupId/items/:productId - Update item
DELETE /api/carts/:groupId/items/:productId - Remove item
DELETE /api/carts/:groupId                  - Clear cart
```

### Products
```
POST /api/products/scrape  - Scrape product from URL
GET  /api/products         - Get all products
GET  /api/products/:id     - Get product details
```

### Orders
```
POST /api/orders           - Create order
GET  /api/orders           - Get orders
GET  /api/orders/:id       - Get order details
PUT  /api/orders/:id/status - Update order status
```

## 🌐 Supported Platforms

- **Fashion**: H&M, Myntra
- **E-commerce**: Amazon, Flipkart
- **Grocery**: Blinkit

## 🔌 WebSocket Events

### Client → Server
- `join-group` - Join group room
- `leave-group` - Leave group room

### Server → Client
- `group-created` - New group created
- `group-updated` - Group info updated
- `cart-updated` - Cart modified
- `order-created` - New order placed
- `member-added` - Member joined
- `member-removed` - Member left

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Write descriptive commit messages
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

## 🐛 Known Issues

1. Product scraping may not work for all sites due to anti-bot measures
2. Order automation is a framework - needs platform API access
3. Real-time updates require stable WebSocket connection

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Created by your team

## 🙏 Acknowledgments

- Expo for the amazing React Native framework
- Socket.IO for real-time capabilities
- MongoDB for flexible data storage
- All the open-source contributors

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@csg-app.com (replace with actual)

---

**Happy Collaborative Shopping! 🛍️**
