import { Router, Request, Response, NextFunction } from "express";

// /** load the service */
import { shop as ShopController } from "../controllers/shop";
import { shopValidationRules, validate } from "../validators/shop";

const router: Router = Router();

/** to list all shops */
router.get("/", ShopController.getAllShops);

// /** to list specific shop */
router.get("/:id", ShopController.getOneShop);

// /** to register a shop */
router.post(
  "/",
  shopValidationRules(),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    const feedback = req.body.feedback as number;
    if (feedback) {
      if (feedback > 3 || feedback < 1) {
        res.status(422).json({
          error: "Feedback can only have one of the 3 values: 1 or 2 or 3",
        });
        return;
      }
    }
    next();
  },
  ShopController.register
);

// /** to update a shop */
router.put(
  "/:id",
  shopValidationRules(),
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    const feedback = req.body.feedback as number;
    if (feedback) {
      if (feedback > 3 || feedback < 1) {
        res.status(422).json({
          error: "Feedback can only have one of the 3 values: 1 or 2 or 3",
        });
        return;
      }
    }
    next();
  },
  ShopController.update
);

// /** to delete a shop */
// router.delete("/:id", ShopController.deleteShop);

/** export the routes to be binded to application */
export default router;
