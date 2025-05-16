import { PrismaClient } from "@prisma/client";
import { decrypt } from "./crypt";
import { Request, Response } from "express";
import {
  BaseResponse,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse,
  ResponseStatus,
} from "@shared/apiTypes";
import UserController from "../controllers/UserController";

const prisma = new PrismaClient();

export const userDataValidation = (
  req: Request<{}, {}, LoginRequest | RegistrationRequest>,
  res: Response<BaseResponse>
) => {
  const { login, password } = req.body;

  if (login.trim().length < 6) {
    res
      .status(ResponseStatus.INVALID_CREDENTIALS)
      .json({ message: "Login length must be longer than 5" });
    return false;
  }

  if (password.trim().length < 8) {
    res
      .status(ResponseStatus.INVALID_CREDENTIALS)
      .json({ message: "Password length must be longer than 7" });
    return false;
  }

  return true;
};

export const authorize = async (sessionToken: string) => {
  try {
    const rawToken = decrypt(sessionToken);

    const session = await prisma.session.findUnique({
      where: { token: rawToken },
    });

    if (!session) {
      throw new Error(`Token ${sessionToken} is illegal`);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
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

export const registerAdmin = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response<RegistrationResponse | BaseResponse>
) => {
  try {
    await UserController.register(req, res);

    const user = await prisma.user.findUnique({
      where: { login: req.body.login },
    });
    if (!user) {
      throw new Error("Error during admin registration");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });
  } catch (err) {
    console.error(err);
  }
};

export const generateRandomPassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 8;

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export const generateRandomLogin = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6;

  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};
