import mongoose, { Document } from 'mongoose';
export interface IGroup extends Document {
    name: string;
    description?: string;
    admin: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    cart: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IGroup, {}, {}, {}, mongoose.Document<unknown, {}, IGroup, {}, {}> & IGroup & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Group.d.ts.map