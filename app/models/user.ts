import { Schema, model, Document } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  avatar: string;
  password: string;
  phoneNum: string;
  address: string;
  balance: number;
  customId: string;
  dob: string;
}

const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  password: { type: String, required: true },
  phoneNum: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  balance: { type: Number, required: true, default: 10_00_000 },
  customId: { type: String, unique: true },
  dob: { type: String, required: true },
});

export const UserModel = model<User>("User", schema);
