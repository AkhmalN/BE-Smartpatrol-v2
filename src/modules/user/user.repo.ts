import {
  IUser,
  UserModel,
  IUserCreateDTO,
  IUserUpdateDTO,
} from "@/models/user.model";
import { logger } from "@/utils/logger";
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
    search,
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
    search?: string;
  }): Promise<IUser[]>;
  getUsersByUnitKerja(unitKerja: string): Promise<IUser[]>;
  checkUserExists(username: string, email: string): Promise<boolean>;
  findUserByUsername(username: string): Promise<IUser | null>;
}

export class UserRepository implements IUserRepository {
  private userModel: Model<IUser>;

  constructor(userModel: Model<IUser>) {
    this.userModel = userModel;
  }

  // Implementation for checking exist user for login
  async findUserByUsername(username: string): Promise<IUser | null> {
    const user = await this.userModel.findOne({ username: username }).exec();
    return user; // Returns true if user exists, false otherwise
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
    const user = await this.userModel.findById(userId).exec();
    return user;
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

  // Implementation for get all user based on pagination
  async getAllUsers({
    page,
    limit,
    sortBy,
    search,
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
    search?: string;
  }): Promise<IUser[]> {
    const filter: any = {};

    if (search) {
      filter.$or = [{ username: { $regex: search, $options: "i" } }];
    }
    const query = this.userModel.find(filter, "-password -__v");
    if (sortBy) {
      query.sort({ username: sortBy === "ASC" ? 1 : -1 });
    }
    if (page && limit) {
      query.skip((page - 1) * limit).limit(limit);
    }
    const users = await query.exec();
    return users;
  }

  // Implementation for getting users by unit kerja
  async getUsersByUnitKerja(unitKerja: string): Promise<IUser[]> {
    const userByUnitKerja = await this.userModel
      .find({ unit_kerja: unitKerja })
      .exec();
    return userByUnitKerja;
  }
}
