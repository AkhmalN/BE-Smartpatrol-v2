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

  // GET /api/users?page=1&size=10&sort=ASC&search={}
  router.get(
    "/",
    protectRoute,
    userController.getAllUsers.bind(userController)
  );

  // GET /api/users/:id
  router.get(
    "/:id",
    protectRoute,
    userController.getUserById.bind(userController)
  );

  // Get /api/users?instansi=UNAS PEJATEN
  router.get(
    "/",
    protectRoute,
    userController.getUserByUnitKerja.bind(userController)
  );
  return router;
}
