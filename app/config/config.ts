import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const BCRYPT_SALT = process.env.BCRYPT_SALT as string;
