import { Request, Response } from "express";
import { IUserService } from "./user.service";

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username dan password harus diisi." });
      return;
    }
    try {
      const user = await this.userService.loginUser({ username, password });

      if (user.not_found) {
        res
          .status(401)
          .json({ message: "Username salah atau akun tidak ditemukan!." });
        return;
      }
      if (user.unauthorized) {
        res.status(403).json({ message: "password salah!." });
        return;
      }

      const access_token = user.access_token;

      res.status(200).json({
        success: true,
        message: "Login successful",
        access_token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error logging in user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }
  }
  async createUser(req: Request, res: Response): Promise<void> {
    const {
      nama_lengkap,
      username,
      email,
      password,
      domisili,
      tempat_lahir,
      tanggal_lahir,
      no_hp,
      role,
      unit_kerja,
    } = req.body;
    const rowData = {
      nama_lengkap,
      username,
      email,
      password,
      domisili,
      tempat_lahir,
      tanggal_lahir: new Date(tanggal_lahir),
      no_hp,
      role,
      unit_kerja: unit_kerja,
    };

    if (!username || !email || !password || !unit_kerja) {
      res.status(400).json({ message: "Semua field harus diisi." });
      return;
    }

    try {
      const newUser = await this.userService.createUser(rowData);
      res.status(201).json({
        message: "User created successfully",
        data: newUser,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error creating user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
      }
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  async getAllUsers(req: Request, res: Response): Promise<void> {
    const { page, size, sortBy, search } = req.query;
    try {
      const users = await this.userService.getAllUsers({
        page: Number(page),
        limit: Number(size) || 10,
        sortBy: sortBy as "ASC" | "DESC",
        search: search ? (search as string) : "",
      });
      res.status(200).json({
        message: "Users retrieved successfully",
        success: true,
        data: users,
        meta: {
          total: users.length,
          page: Number(page) || 1,
          limit: Number(size) || 10,
          sortBy: sortBy || "ASC",
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  async getUserByUnitKerja(req: Request, res: Response) {
    const { unit_kerja } = req.query;
    if (!unit_kerja) {
      res.status(404).json({
        message: "Unit kerja tidak ditemukan",
      });
    }

    try {
      const user = this.userService.getUsersByUnitKerja(unit_kerja as string);
      res.status(200).json({
        message: "Users retrieved successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
