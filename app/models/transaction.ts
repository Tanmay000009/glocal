import { Schema, model, Document, ObjectId } from "mongoose";

interface Transaction extends Document {
  type: string;
  uid: string;
  status: string;
  shop: ObjectId;
  user: ObjectId;
  perk: ObjectId;
  amount: number;
  discountedAmount: number;
  CashbackAmount: number;
  perkValue: number;
  userName: string;
  shopName: string;
  userCutomId: string;
  shopCustomId: string;
  userNumber: number;
  shopNumber: number;
  shopFeedback: number;
  perkType: string;
}

const schema = new Schema<Transaction>(
  {
    type: { type: String, required: true }, // credit or debit // all transactions for shop of type credit // for user add balance -> credit && pay to shop -> debit
    uid: { type: String, required: true }, // to search user
    status: { type: String, required: true, default: "spam" }, // approved, unapproved, unsuccesful, spam, cashbackPending
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userCutomId: { type: String, required: true },
    userNumber: { type: Number, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    shopName: { type: String, required: true },
    shopCustomId: { type: String, required: true },
    shopNumber: { type: Number, required: true },
    perk: { type: Schema.Types.ObjectId, ref: "Perk" },
    perkValue: { type: Number },
    perkType: { type: String },
    amount: { type: Number, required: true },
    shopFeedback: { type: Number, max: 3, min: 1 },
    discountedAmount: { type: Number }, // Amount after applying discount if any
    CashbackAmount: { type: Number }, // Amount of cashback a user receives
  },
  { timestamps: true }
);

export const TransactionModel = model<Transaction>("Transaction", schema);
