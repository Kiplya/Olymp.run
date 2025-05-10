import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import { Constants } from "../Constants";
import { users } from "@prisma/client";
import {
  LoginRequest,
  BaseResponse,
  ResponseStatus,
  EmptyResponse,
} from "@shared/apiTypes";
import { authorize } from "../utils/user";
import { loginDataValidation, resServerError } from "../utils/common";

export default class UserController {
  static async login(
    req: Request<{}, {}, LoginRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      if (!loginDataValidation(req, res)) {
        return;
      }

      const sessionToken = await UserService.login(req.body);

      if (!sessionToken) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Invalid credentials" });

        return;
      }

      res.cookie(Constants.SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.status(ResponseStatus.SUCCESS).json({ message: "Logged in" });
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async logout(req: Request, res: Response<EmptyResponse>) {
    try {
      const sessionToken = req.cookies?.[Constants.SESSION_COOKIE_NAME];
      if (sessionToken) {
        res.clearCookie(Constants.SESSION_COOKIE_NAME);
        await UserService.logout(sessionToken);
      }
      res.sendStatus(ResponseStatus.NO_CONTENT);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async register(
    req: Request<{}, {}, LoginRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      if (!loginDataValidation(req, res)) {
        return;
      }

      await UserService.register(req.body);

      res
        .status(ResponseStatus.SUCCESS)
        .json({ message: "Successful registered" });
    } catch (err: any) {
      if (err?.code === "P2002") {
        console.error(err);
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Login is already taken" });

        return;
      }
      resServerError(res, err);
    }
  }

  static async authMiddleware(
    req: Request & { user?: users },
    res: Response<BaseResponse>,
    next: NextFunction
  ) {
    try {
      const sessionToken = req.cookies?.[Constants.SESSION_COOKIE_NAME];
      if (!sessionToken) {
        res
          .status(ResponseStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
        return;
      }

      const { user, isAuthorized } = await authorize(sessionToken);
      if (!isAuthorized) {
        res.clearCookie(Constants.SESSION_COOKIE_NAME);
        await UserService.logout(sessionToken);

        res
          .status(ResponseStatus.UNAUTHORIZED)
          .json({ message: "Session expired or invalid" });
        return;
      }

      req.user = user!;
      next();
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async adminMiddleware(
    req: Request & { user?: users },
    res: Response<BaseResponse>,
    next: NextFunction
  ) {
    try {
      if (!req?.user?.isAdmin) {
        res
          .status(ResponseStatus.FORBIDDEN)
          .json({ message: "Admin access required" });
        return;
      }

      next();
    } catch (err) {
      resServerError(res, err);
    }
  }
}
