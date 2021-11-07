import { Router } from "express";

// /** load the service */
import { user as UserController } from "../controllers/user";
import { userValidationRules, validate } from "../validators/user";

const router: Router = Router();

/** to list all users */
router.get("/", UserController.getAllUsers);

// /** to list specific user */
router.get("/:id", UserController.getOneUser);

/** to register a user */
router.post("/", userValidationRules(), validate, UserController.register);

// /** to update a user */
router.put("/:id", userValidationRules(), validate, UserController.update);

// /** to delete a user */
// router.delete("/:id", UserController.deleteUser);

/** export the routes to be binded to application */
export default router;
