import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import dotenv from "dotenv";

/** load modules as routes */
import UserRoutes from "./app/routes/user";
import ShopRoutes from "./app/routes/shop";
import PerkRoutes from "./app/routes/perks";
import AuthRouter from "./app/routes/auth";
import initializeMongoDB from "./app/database/db";

initializeMongoDB();

dotenv.config();

const PORT = process.env.PORT || 3000;

/** declare application and load middleware */
const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello from the TS world!</h1>");
});

app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRouter);
app.use("/api/shops", ShopRoutes);
app.use("/api/perks", PerkRoutes);

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
