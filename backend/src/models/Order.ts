import mongoose, { Document, Schema } from 'mongoose';
import { Platform } from './Product';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  group: mongoose.Types.ObjectId;
  orderedBy: mongoose.Types.ObjectId;
  items: IOrderItem[];
  platform: Platform;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  externalOrderId?: string;
  deliveryAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  orderedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  platform: {
    type: String,
    enum: Object.values(Platform),
    required: true
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  externalOrderId: {
    type: String
  },
  deliveryAddress: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema);
