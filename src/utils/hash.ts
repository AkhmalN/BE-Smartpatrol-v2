import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error hashing password: " + error.message);
    }
    throw new Error("Error hashing password: " + String(error));
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error comparing password: " + error.message);
    }
    throw new Error("Error comparing password: " + String(error));
  }
}
