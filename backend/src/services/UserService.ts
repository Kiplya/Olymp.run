import { UserDeleteByLoginRequest, LoginRequest } from "@shared/apiTypes";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { encrypt, decrypt, hash } from "../utils/crypt";
import { prisma } from "../handlers";

export default class UserService {
  static async login({ login, password }: LoginRequest) {
    const user = await prisma.user.findUnique({
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

    await prisma.session.create({
      data: { userId: user.id, token: rawToken },
    });

    return encryptedToken;
  }

  static async logout(sessionToken: string) {
    const rawToken = decrypt(sessionToken);

    const session = await prisma.session.findUnique({
      where: { token: rawToken },
    });

    if (!session) {
      return;
    }

    await prisma.session.delete({
      where: { token: rawToken },
    });
  }

  static async register({ login, password }: LoginRequest) {
    const hashedPassword = await hash(password);

    await prisma.user.create({
      data: { login, password: hashedPassword },
    });
  }

  static async deleteByLogin({ login }: UserDeleteByLoginRequest) {
    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) {
      return false;
    }

    await prisma.user.delete({
      where: { login },
    });
    return true;
  }
}
