import mongoose, { Document } from 'mongoose';
import { Platform } from './Product';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    CONFIRMED = "confirmed",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    FAILED = "failed"
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
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map