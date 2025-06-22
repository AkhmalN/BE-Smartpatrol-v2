import {
  IUser,
  UserModel,
  IUserCreateDTO,
  IUserUpdateDTO,
} from "@/models/user.model";
import { Model } from "mongoose";

export interface IUserRepository {
  createUser(userData: IUserCreateDTO): Promise<IUser>;
  getUserById(userId: string): Promise<IUser | null>;
  updateUser(userId: string, userData: IUserUpdateDTO): Promise<IUser | null>;
  deleteUser(userId: string): Promise<void>;
  getAllUsers({
    page,
    limit,
    sortBy,
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
  }): Promise<IUser[]>;
  getUsersByUnitKerja(unitKerja: string): Promise<IUser[]>;
  checkUserExists(username: string, email: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  private userModel: Model<IUser>;

  constructor(userModel: Model<IUser>) {
    this.userModel = userModel;
  }

  // Implementation for checking if a user exists by username or email
  async checkUserExists(username: string, email: string): Promise<boolean> {
    const user = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    return !!user; // Returns true if user exists, false otherwise
  }

  // Implementation for creating a user
  async createUser(userData: IUserCreateDTO): Promise<IUser> {
    const newUser = new this.userModel(userData);
    const user = await newUser.save();
    return user;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    // Implementation for getting a user by ID
    throw new Error("Method not implemented.");
  }

  async updateUser(
    userId: string,
    userData: IUserUpdateDTO
  ): Promise<IUser | null> {
    // Implementation for updating a user
    throw new Error("Method not implemented.");
  }

  async deleteUser(userId: string): Promise<void> {
    // Implementation for deleting a user
    throw new Error("Method not implemented.");
  }

  async getAllUsers({
    page = 1,
    limit = 10,
    sortBy = "ASC",
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
  }): Promise<IUser[]> {
    // Implementation for getting all users with pagination and sorting
    throw new Error("Method not implemented.");
  }

  async getUsersByUnitKerja(unitKerja: string): Promise<IUser[]> {
    // Implementation for getting users by unit kerja
    throw new Error("Method not implemented.");
  }
}
