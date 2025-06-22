import { Router } from "express";
import { UserController } from "./user.controller";
import { protectRoute, roleApproved } from "@/middlewares/auth.middleware";

export function createUserRouter(userController: UserController): Router {
  const router = Router();
  // POST /api/users
  router.post(
    "/create",
    protectRoute,
    roleApproved(["admin", "chief"]),
    userController.createUser.bind(userController)
  );
  // POST /api/users/login
  router.post("/login", userController.loginUser.bind(userController));
  return router;
}
