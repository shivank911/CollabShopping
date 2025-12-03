import mongoose, { Document, Schema } from 'mongoose';

export enum Platform {
  HM = 'hm',
  MYNTRA = 'myntra',
  AMAZON = 'amazon',
  FLIPKART = 'flipkart',
  BLINKIT = 'blinkit',
  OTHER = 'other'
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  productUrl: string;
  platform: Platform;
  externalId: string;
  category?: string;
  brand?: string;
  inStock: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  imageUrl: {
    type: String
  },
  productUrl: {
    type: String,
    required: [true, 'Product URL is required']
  },
  platform: {
    type: String,
    enum: Object.values(Platform),
    required: [true, 'Platform is required']
  },
  externalId: {
    type: String,
    required: [true, 'External product ID is required']
  },
  category: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Compound index for platform and externalId
productSchema.index({ platform: 1, externalId: 1 }, { unique: true });

export default mongoose.model<IProduct>('Product', productSchema);
