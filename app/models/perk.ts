import { Schema, model, Document, ObjectId } from "mongoose";

interface Perk extends Document {
  perkName: string;
  shop: ObjectId;
  type: string;
  value: number;
  feedback1: number;
  feedback2: number;
  feedback3: number;
  maxValue: number;
  generatedRevenue: number;
}

const schema = new Schema<Perk>(
  {
    perkName: { type: String, required: true },
    shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    type: { type: String, required: true }, // "cashback" or "discount"
    value: { type: Number, required: true }, // ex: 5% cashback/discount
    feedback1: { type: Number }, // 1 = bad
    feedback2: { type: Number }, // 2 = med
    feedback3: { type: Number }, // 3 = good
    maxValue: { type: Number, required: true },
    generatedRevenue: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const PerkModel = model<Perk>("Perk", schema);
