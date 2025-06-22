import {
  IUser,
  IUserCreateDTO,
  IUserResponseDTO,
  IUserUpdateDTO,
} from "@/models/user.model";
import { IUserRepository } from "./user.repo";
import { hashPassword } from "@/utils/hash";

export interface IUserService {
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
  changeUserPassword(userId: string, newPassword: string): Promise<void>;
  loginUser(username: string, password: string): Promise<IUser | null>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
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
    page,
    limit,
    sortBy,
  }: {
    page?: number;
    limit?: number;
    sortBy?: "ASC" | "DESC";
  }): Promise<IUser[]> {
    return this.userRepository.getAllUsers({ page, limit, sortBy });
  }

  async getUsersByUnitKerja(unitKerja: string): Promise<IUser[]> {
    return this.userRepository.getUsersByUnitKerja(unitKerja);
  }

  async changeUserPassword(userId: string, newPassword: string): Promise<void> {
    // Implementation for changing user password
    throw new Error("Method not implemented.");
  }

  async loginUser(username: string, password: string): Promise<IUser | null> {
    // Implementation for user login
    throw new Error("Method not implemented.");
  }
}
