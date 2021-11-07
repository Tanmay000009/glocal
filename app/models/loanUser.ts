import { Schema, model, Document, ObjectId } from "mongoose";

export interface LoanUser extends Document {
  status: string;
  shop: ObjectId;
  user: ObjectId;
  amountLoaned: number;
  userName: string;
  shopName: string;
  userCutomId: string;
  shopCustomId: string;
  userNumber: string;
  shopNumber: string;
  loan: ObjectId;
  duration: number;
}

const schema = new Schema<LoanUser>(
  {
    status: { type: String, required: true }, // Paid or unpaid : Paid = user got money back
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userCutomId: { type: String, required: true },
    userNumber: { type: String, required: true },
    amountLoaned: { type: Number, required: true },
    loan: { type: Schema.Types.ObjectId, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    shopName: { type: String, required: true },
    shopCustomId: { type: String, required: true },
    shopNumber: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export const LoanUserModel = model<LoanUser>("LoanUser", schema);
