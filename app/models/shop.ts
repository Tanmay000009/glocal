import { Schema, model, Document, ObjectId } from "mongoose";

export interface Shop extends Document {
  name: string;
  email: string;
  avatar: string;
  password: string;
  phoneNum: string;
  address: string;
  balance: number;
  customId: string;
  earning: number;
  activeLoans: number;
  totalLoans: number;
  totalLoanAmount: number; // Paid or unpaid loan amount
  loanUnpaidAmount: number; // Loan amount yet to be paid
  loans: Array<ObjectId>;
}

const schema = new Schema<Shop>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  password: { type: String, required: true },
  phoneNum: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  customId: { type: String, unique: true },
  earning: { type: Number, default: 0 },
  activeLoans: { type: Number, default: 0 },
  totalLoans: { type: Number, default: 0 },
  totalLoanAmount: { type: Number, default: 0 },
  loanUnpaidAmount: { type: Number, default: 0 },
  loans: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

export const ShopModel = model<Shop>("Shop", schema);
