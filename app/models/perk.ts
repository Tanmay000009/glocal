import { Schema, model, Document, ObjectId } from "mongoose";

interface Perk extends Document {
  shop: ObjectId;
  type: string;
  value?: Number;
  feedback?: Number;
}

const schema = new Schema<Perk>(
  {
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    type: { type: String, required: true }, // "cashback" or "discount"
    value: { type: Number, required: true }, // ex: 5% cashback/discount
    feedback: { type: Number, max: 3, min: 1 }, // 1 = bad | 2 = med | 3 = good
  },
  { timestamps: true }
);

export const PerkModel = model<Perk>("Perk", schema);
