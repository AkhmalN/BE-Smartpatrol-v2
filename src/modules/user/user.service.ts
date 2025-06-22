import {
  IUser,
  IUserCreateDTO,
  IUserLoginDTO,
  IUserResponseDTO,
  IUserUpdateDTO,
} from "@/models/user.model";
import { IUserRepository } from "./user.repo";
import { comparePassword, hashPassword } from "@/utils/hash";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export interface IUserService {
  createUser(userData: IUserCreateDTO): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: IUserUpdateDTO): Promise<IUser | null>;
  deleteUser(userId: string): Promise<void>;
  getAllUsers({
    page,
    limit,
    sortBy,
    search,
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
    search?: string;
  }): Promise<IUser[]>;
  getUsersByUnitKerja(unitKerja: string): Promise<IUser[]>;
  changeUserPassword(userId: string, newPassword: string): Promise<void>;
  loginUser(credentials: IUserLoginDTO): Promise<{
    access_token: string;
    unauthorized: boolean;
    not_found: boolean;
  }>;
}

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  generateAccessToken(access_token: string): string {
    throw new Error("Method not implemented.");
  }

  async createUser(userData: IUserCreateDTO): Promise<IUser> {
    const existingUser = await this.userRepository.checkUserExists(
      userData.username,
      userData.email
    );
    if (existingUser) {
      throw new Error(
        "User dengan username atau email sudah ada atau digunakan."
      );
    }
    const hashedPassword = await hashPassword(userData.password);
    const newUser = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
    return newUser;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return this.userRepository.getUserById(userId);
  }

  async updateUser(
    userId: string,
    userData: IUserUpdateDTO
  ): Promise<IUser | null> {
    return this.userRepository.updateUser(userId, userData);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }

  async getAllUsers({
    page = 1,
    limit = 10,
    sortBy = "ASC",
    search = "",
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
    search?: string;
  }): Promise<IUser[]> {
    return this.userRepository.getAllUsers({ page, limit, sortBy, search });
  }

  async getUsersByUnitKerja(unitKerja: string): Promise<IUser[]> {
    return this.userRepository.getUsersByUnitKerja(unitKerja);
  }

  async changeUserPassword(userId: string, newPassword: string): Promise<void> {
    // Implementation for changing user password
    throw new Error("Method not implemented.");
  }

  async loginUser(credentials: IUserLoginDTO): Promise<{
    access_token: string;
    unauthorized: boolean;
    not_found: boolean;
  }> {
    const { username, password } = credentials;
    const findUser = await this.userRepository.findUserByUsername(username);

    // Check if user exists
    if (!findUser) {
      return {
        access_token: "",
        not_found: true,
        unauthorized: false,
      };
    }
    const isPasswordValid = await comparePassword(password, findUser.password);
    // Check if password is valid
    if (!isPasswordValid) {
      return {
        access_token: "",
        not_found: false,
        unauthorized: true,
      };
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        id: findUser._id,
        role: findUser.role,
        username: findUser.username,
      },
      JWT_SECRET,
      {
        expiresIn: 1 * 60 * 60 * 24,
      }
    );
    return {
      access_token: token,
      unauthorized: false,
      not_found: false,
    };
  }
}
