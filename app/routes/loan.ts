import { Router } from "express";

// /** load the service */
import { loan as LoanController } from "../controllers/loan";
// import { LoanValidationRules, validate } from "../validators/loan";

const router: Router = Router();

/** to list all Loans */
router.get("/", LoanController.getAllLoans);

/** to list specific Loan */
router.get("/:id", LoanController.getOneLoan);

/** to register a Loan */
router.post("/", LoanController.register);

/** to allow user to invest in a loan */
router.post("/:id/invest", LoanController.userLoan);

/** export the routes to be binded to application */
export default router;
