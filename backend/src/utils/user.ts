import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authorize = async (sessionId: string) => {
  try {
    const session = await prisma.sessions.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return false;
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user_id },
    });

    if (!user) {
      throw new Error(`User with sid ${sessionId} not found`);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
