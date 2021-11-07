import { Schema, model, Document, ObjectId } from "mongoose";

interface CashBack extends Document {
  amount: number;
  uid: string;
  shop: ObjectId;
  user: ObjectId;
}

const schema = new Schema<CashBack>(
  {
    amount: { type: Number, required: true },
    uid: { type: String, required: true }, // to search user
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CashBackModel = model<CashBack>("CashBack", schema);
