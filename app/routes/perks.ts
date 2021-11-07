import { Router } from "express";

// /** load the service */
import { perk as PerkController } from "../controllers/perk";
// import {
//   perkValidationRules,
//   validate,
// } from "../app/validators/shop.validator";

const router: Router = Router();

/** to list all perks */
router.get("/", PerkController.getAllPerks);

// /** to list specific perk */
router.get("/:id", PerkController.getOnePerk);

// /** to register a perk */
// perkValidationRules(), validate,
router.post("/", PerkController.register);

// /** to update a perk */
// perkValidationRules(), validate,
router.put("/:id", PerkController.update);

// /** to delete a perk */
// router.delete("/:id", PerkController.deletePerk);

/** export the routes to be binded to application */
export default router;
