import { connect, ConnectOptions } from "mongoose";
import { MONGO_URI } from "../config/config";

/**
 * Initializes MongoDB connection using configs and logs status
 */
const initializeMongoDB = async () => {
  try {
    await connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("DB connected");
  } catch (error) {
    console.log((error as Error).message);
  }
};

export default initializeMongoDB;
