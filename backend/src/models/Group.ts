import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  admin: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  cart: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }
}, {
  timestamps: true
});

export default mongoose.model<IGroup>('Group', groupSchema);
