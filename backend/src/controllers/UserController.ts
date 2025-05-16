import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import { Constants } from "../Constants";
import { user } from "@prisma/client";
import {
  LoginRequest,
  BaseResponse,
  ResponseStatus,
  EmptyResponse,
  RegistrationRequest,
  RegistrationResponse,
  UserDeleteByLoginRequest,
} from "@shared/apiTypes";
import { userDataValidation, authorize } from "../utils/user";
import { resServerError } from "../utils/common";

export default class UserController {
  static async login(
    req: Request<{}, {}, LoginRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      if (!userDataValidation(req, res)) {
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
    req: Request<{}, {}, RegistrationRequest>,
    res: Response<RegistrationResponse | BaseResponse>
  ) {
    try {
      if (!userDataValidation(req, res)) {
        return;
      }

      await UserService.register(req.body);

      res.status(ResponseStatus.SUCCESS).json({
        login: req.body.login,
        password: req.body.password,
      });
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

  static async deleteByLogin(
    req: Request<{}, {}, UserDeleteByLoginRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      if (!req.body.login.trim()) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Login is undefined" });
        return;
      }

      const isDeleted = await UserService.deleteByLogin(req.body);
      if (!isDeleted) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: `User ${req.body.login} not found` });
        return;
      }

      res
        .status(ResponseStatus.SUCCESS)
        .json({ message: `User ${req.body.login} successfully deleted` });
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async authMiddleware(
    req: Request & { user?: user },
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
    req: Request & { user?: user },
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
