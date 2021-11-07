import { Schema, model, Document, ObjectId } from "mongoose";

interface Perk extends Document {
  perkName: string;
  shop: ObjectId;
  type: string;
  value: number;
  feedback: number;
  maxValue: number;
}

const schema = new Schema<Perk>(
  {
    perkName: { type: String, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    type: { type: String, required: true }, // "cashback" or "discount"
    value: { type: Number, required: true }, // ex: 5% cashback/discount
    feedback: { type: Number, max: 3, min: 1 }, // 1 = bad | 2 = med | 3 = good
    maxValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export const PerkModel = model<Perk>("Perk", schema);
