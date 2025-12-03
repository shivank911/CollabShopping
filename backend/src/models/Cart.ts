import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  addedBy: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface ICart extends Document {
  group: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const cartSchema = new Schema<ICart>({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

export default mongoose.model<ICart>('Cart', cartSchema);
