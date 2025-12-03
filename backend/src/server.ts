import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application } from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes';
import cartRoutes from './routes/cart.routes';
import groupRoutes from './routes/group.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes';
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collaborative-shopping';

// Debug: Log connection string (hide password)
console.log('🔍 MongoDB URI:', MONGODB_URI.replace(/:([^@]+)@/, ':****@'));

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*'
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-group', (groupId: string) => {
    socket.join(`group-${groupId}`);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  socket.on('leave-group', (groupId: string) => {
    socket.leave(`group-${groupId}`);
    console.log(`Socket ${socket.id} left group ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export { io };
export default app;
