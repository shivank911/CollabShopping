import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, {}> & ICart & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Cart.d.ts.map