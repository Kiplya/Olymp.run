import { PrismaClient, sessions, users } from "@prisma/client";
import { LoginRequest } from "@shared/apiTypes";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default class UserService {
  static async login({ login, password }: LoginRequest) {
    const user: users | null = await prisma.users.findUnique({
      where: { login },
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    const session: sessions = await prisma.sessions.create({
      data: { user_id: user.id },
    });

    return session.id;
  }

  static async logout(sessionId: string) {
    const session = await prisma.sessions.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return;
    }

    await prisma.sessions.delete({
      where: { id: sessionId },
    });
  }

  static async register({ login, password }: LoginRequest) {}
}
