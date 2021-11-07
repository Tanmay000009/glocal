import { Schema, model, Document, ObjectId } from "mongoose";

export interface Loan extends Document {
  status: string;
  shop: ObjectId;
  users: Array<ObjectId>;
  amount: number;
  shopName: string;
  shopCustomId: string;
  shopNumber: number;
  duration: number;
  amountLoaned: number;
  amountUnpaid: number;
}

const schema = new Schema<Loan>(
  {
    status: { type: String, required: true }, // paid or unpaid
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    shopName: { type: String, required: true },
    shopCustomId: { type: String, required: true },
    shopNumber: { type: Number, required: true },
    amount: { type: Number, required: true },
    amountLoaned: { type: Number, default: 0 }, // 500 out of 1000rs loaned
    amountUnpaid: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    users: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export const LoanModel = model<Loan>("Loan", schema);
