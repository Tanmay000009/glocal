import { Schema, model, Document, ObjectId } from "mongoose";

interface Transaction extends Document {
  status: string;
  shop: ObjectId;
  user: ObjectId;
  perk: ObjectId;
  amount?: Number;
  perkValue?: Number;
  userName: string;
  shopName: string;
  userId: string;
  shopId: string;
  userNumber?: Number;
  shopNumber?: Number;
  shopFeedback?: Number;
}

const schema = new Schema<Transaction>(
  {
    status: { type: String, required: true, default: "False" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    userNumber: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    shopName: { type: String, required: true },
    shopId: { type: String, required: true },
    shopNumber: { type: Number, required: true },
    perk: { type: Schema.Types.ObjectId, ref: "Perk" },
    perkValue: { type: Number },
    amount: { type: Number, required: true },
    shopFeedback: { type: Number, max: 3, min: 1 },
  },
  { timestamps: true }
);

export const TransactionModel = model<Transaction>("Transaction", schema);
