import mongoose, { Document } from 'mongoose';
export declare enum Platform {
    HM = "hm",
    MYNTRA = "myntra",
    AMAZON = "amazon",
    FLIPKART = "flipkart",
    BLINKIT = "blinkit",
    OTHER = "other"
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
declare const _default: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Product.d.ts.map