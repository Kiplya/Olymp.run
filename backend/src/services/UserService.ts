import { PrismaClient, users } from "@prisma/client";
import { DeleteRequest, LoginRequest } from "@shared/apiTypes";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { encrypt, decrypt, hash } from "../utils/crypt";

const prisma = new PrismaClient();

export default class UserService {
  static async login({ login, password }: LoginRequest) {
    const user = await prisma.users.findUnique({
      where: { login },
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const encryptedToken = encrypt(rawToken);

    await prisma.sessions.create({
      data: { user_id: user.id, token: rawToken },
    });

    return encryptedToken;
  }

  static async logout(sessionToken: string) {
    const rawToken = decrypt(sessionToken);

    const session = await prisma.sessions.findUnique({
      where: { token: rawToken },
    });

    if (!session) {
      return;
    }

    await prisma.sessions.delete({
      where: { token: rawToken },
    });
  }

  static async register({ login, password }: LoginRequest) {
    const hashedPassword = await hash(password);

    await prisma.users.create({
      data: { login, password: hashedPassword },
    });
  }

  static async delete({ login }: DeleteRequest) {
    const user = await prisma.users.findUnique({ where: { login } });
    if (!user) {
      return false;
    }

    await prisma.users.delete({
      where: { login },
    });
    return true;
  }
}
