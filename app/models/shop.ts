import { Schema, model, Document } from "mongoose";

export interface Shop extends Document {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  phoneNum: string;
  address: string;
  balance?: Number;
  customId: string;
  earning?: Number;
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
});

export const ShopModel = model<Shop>("Shop", schema);
