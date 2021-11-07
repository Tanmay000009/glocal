import { Router } from "express";

/** load the service */
import { auth as AuthController } from "../controllers/auth";
// import {
//   userValidationRules,
//   validate,
// } from "../app/validators/user.validator";

// /** load the middlewares */
// import { auth } from ("../app/middleware/auth");

const router = Router();

/** to get loggged in user */
// router.get("/", auth, AuthController.currentUser);
router.get("/", AuthController.currentUser);

/** to authenticate a user */
router.post("/", AuthController.authenticate);

/** export the routes to be binded to application */
export default router;
