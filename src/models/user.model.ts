import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  nama_lengkap: string;
  username: string;
  email: string;
  password: string;
  domisili: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_hp: string;
  role: string;
  unit_kerja: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateDTO {
  nama_lengkap: string;
  username: string;
  email: string;
  password: string;
  domisili: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_hp: string;
  role: string;
  unit_kerja: string;
}

export interface IUserUpdateDTO {
  nama_lengkap?: string;
  username?: string;
  email?: string;
  password?: string;
  domisili?: string;
  tempat_lahir?: string;
  tanggal_lahir?: Date;
  no_hp?: string;
  role?: string;
  unit_kerja?: string;
}

export interface IUserResponseDTO {
  _id: string;
  nama_lengkap: string;
  username: string;
  email: string;
  domisili: string;
  tempat_lahir: string;
  tanggal_lahir: Date;
  no_hp: string;
  role: string;
  unit_kerja: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    nama_lengkap: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    domisili: { type: String, required: true },
    tempat_lahir: { type: String, required: true },
    tanggal_lahir: { type: Date, required: true },
    no_hp: { type: String, required: true },
    role: { type: String, required: true },
    unit_kerja: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUser>("User", userSchema);
