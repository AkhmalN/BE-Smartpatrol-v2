import { Router } from "express";
import { Model } from "mongoose";

import { IUserRepository, UserRepository } from "./user.repo";

import { IUserService, UserService } from "./user.service";

import { UserController } from "./user.controller";
import { createUserRouter } from "./user.route";

import { IUser } from "@/models/user.model";

export default function userModule(userModel: Model<IUser>): Router {
  // Inisialisasi Repository
  const userRepository: IUserRepository = new UserRepository(userModel);

  // Inisialisasi Service
  const userService: IUserService = new UserService(userRepository);

  // Inisialisasi Controller
  const userController: UserController = new UserController(userService);

  // Buat dan kembalikan Router
  const userRouter: Router = createUserRouter(userController);

  return userRouter;
}
