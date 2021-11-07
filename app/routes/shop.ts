import { Router } from "express";

// /** load the service */
import { shop as ShopController } from "../controllers/shop";
// import {
//   shopValidationRules,
//   validate,
// } from "../app/validators/shop.validator";

const router: Router = Router();

/** to list all shops */
router.get("/", ShopController.getAllShops);

// /** to list specific shop */
router.get("/:id", ShopController.getOneShop);

// /** to register a shop */
// shopValidationRules(), validate,
router.post("/", ShopController.register);

// /** to update a shop */
// shopValidationRules(), validate,
router.put("/:id", ShopController.update);

// /** to delete a shop */
// router.delete("/:id", ShopController.deleteShop);

/** export the routes to be binded to application */
export default router;
