import { Router } from "express";

// /** load the service */
import { cashBack as cashBackController } from "../controllers/cashback";

const router: Router = Router();

/** to list all transactions */
router.get("/", cashBackController.getAllCashBacks);

/** export the routes to be binded to application */
export default router;
