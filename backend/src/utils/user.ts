import { PrismaClient } from "@prisma/client";
import { decrypt } from "./crypt";

const prisma = new PrismaClient();

export const authorize = async (sessionToken: string) => {
  try {
    const rawToken = decrypt(sessionToken);

    const session = await prisma.sessions.findUnique({
      where: { token: rawToken },
    });

    if (!session) {
      throw new Error(`Token ${sessionToken} is illegal`);
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user_id },
    });

    if (!user) {
      throw new Error(`User with token ${rawToken} not found`);
    }

    return { user, isAuthorized: true };
  } catch (err) {
    console.error(err);
    return { user: null, isAuthorized: false };
  }
};
