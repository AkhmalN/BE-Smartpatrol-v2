import { Request, Response } from "express";
import { IUserService } from "./user.service";
import { logger } from "@/utils/logger";

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }
  async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        message: "User service is healthy",
      });
    } catch (error) {
      logger.error("Error checking user service health:", error);
      res.status(500).json({
        message: "Error checking user service health",
      });
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
}
