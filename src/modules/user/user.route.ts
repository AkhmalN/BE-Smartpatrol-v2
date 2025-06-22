import { Router } from "express";
import { UserController } from "./user.controller";

export function createUserRouter(userController: UserController): Router {
  const router = Router();
  // POST /api/users
  router.post("/create", userController.createUser.bind(userController));
  router.get("/health", userController.checkHealth.bind(userController));
  return router;
}
