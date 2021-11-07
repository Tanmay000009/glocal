import { Router } from "express";

// /** load the service */
import { transaction as TransactionController } from "../controllers/transaction";
// import { transactionValidationRules, validate } from "../validators/transaction";

const router: Router = Router();

/** to list all transactions */
router.get("/", TransactionController.getAllTransactions);

/** to list specific transaction */
router.get("/:id", TransactionController.getOneTransaction);

/** to register a transaction */
router.post("/:id", TransactionController.register);

/** to approve a transaction */
router.get("/:id/approve", TransactionController.approve);

/** to cancel a transaction */
router.get("/:id/cancel", TransactionController.cancel);

/** export the routes to be binded to application */
export default router;
