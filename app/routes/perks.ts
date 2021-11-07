import { NextFunction, Request, Response, Router } from "express";

// /** load the service */
import { perk as PerkController } from "../controllers/perk";

const router: Router = Router();

/** to list all perks */
router.get("/", PerkController.getAllPerks);

// /** to list specific perk */
router.get("/:id", PerkController.getOnePerk);

// /** to register a perk */
router.post(
  "/",
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
  PerkController.register
);

// /** to update a perk */
router.put(
  "/:id",
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
  PerkController.update
);

router.post("/:shopId", PerkController.findShopPerk);

// /** to delete a perk */
router.delete("/:id", PerkController.deletePerk);

/** export the routes to be binded to application */
export default router;
