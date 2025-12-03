# Backend API - Collaborative Shopping Group

Backend API server for the Collaborative Shopping Group application.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Group Management**: Create, update, and manage shopping groups
- **Shared Carts**: Real-time synchronized shopping carts using Socket.IO
- **Product Scraping**: Extract product details from multiple e-commerce platforms
- **Order Management**: Track and manage orders across platforms
- **Order Automation**: Automated order placement (framework in place)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Real-time**: Socket.IO
- **Web Scraping**: Axios + Cheerio
- **Validation**: express-validator
- **Language**: TypeScript

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/collaborative-shopping
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

### Running the Server

#### Development mode (with auto-reload):
```bash
npm run dev
```

#### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get all user's groups
- `GET /api/groups/:id` - Get specific group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/:id/members` - Add member to group
- `DELETE /api/groups/:id/members/:userId` - Remove member

### Carts
- `GET /api/carts/:groupId` - Get group cart
- `POST /api/carts/:groupId/items` - Add item to cart
- `PUT /api/carts/:groupId/items/:productId` - Update cart item
- `DELETE /api/carts/:groupId/items/:productId` - Remove from cart
- `DELETE /api/carts/:groupId` - Clear cart

### Products
- `POST /api/products/scrape` - Scrape product from URL
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id/status` - Update order status

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   └── server.ts         # Entry point
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env.example
```

## Supported Platforms

- Amazon
- Flipkart
- Myntra
- H&M
- Blinkit

## Socket.IO Events

### Client → Server
- `join-group` - Join a group room
- `leave-group` - Leave a group room

### Server → Client
- `group-created` - New group created
- `group-updated` - Group updated
- `group-deleted` - Group deleted
- `member-added` - Member added to group
- `member-removed` - Member removed from group
- `cart-updated` - Cart modified
- `cart-cleared` - Cart cleared
- `order-created` - New order placed
- `order-updated` - Order status changed

## Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Test
```bash
npm test
```

## Notes

- The order automation feature is a framework - actual automation requires:
  - Official API access from platforms
  - Browser automation with Puppeteer
  - Payment gateway integration
  - Proper error handling

- Product scraping is basic and may need updates as websites change their structure

## License

MIT
