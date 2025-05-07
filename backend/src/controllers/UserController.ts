import { Request, Response, NextFunction } from "express";
import UserService from "../services/UserService";
import { Constants } from "../Constants";
import {
  LoginRequest,
  BaseResponse,
  ResponseStatus,
  EmptyResponse,
} from "@shared/apiTypes";
import { authorize } from "../utils/user";
import { resServerError } from "../utils/common";

export default class UserController {
  static async login(
    req: Request<{}, {}, LoginRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      const sessionId = await UserService.login(req.body);

      if (!sessionId) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Invalid credentials" });

        return;
      }

      res.cookie(Constants.SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      res.status(ResponseStatus.SUCCESS).json({ message: "Logged in" });
    } catch (err: any) {
      resServerError(res, err);
    }
  }

  static async logout(req: Request, res: Response<EmptyResponse>) {
    try {
      const sessionId = req.cookies?.[Constants.SESSION_COOKIE_NAME];
      if (sessionId) {
        res.clearCookie(Constants.SESSION_COOKIE_NAME);
        await UserService.logout(sessionId);
      }
      res.status(ResponseStatus.NO_CONTENT).send();
    } catch (err: any) {
      resServerError(res, err);
    }
  }

  static async register(
    req: Request<{}, {}, LoginRequest>,
    res: Response<BaseResponse>
  ) {
    try {
    } catch (err: any) {
      resServerError(res, err);
    }
  }

  static async authMiddleware(
    req: Request,
    res: Response<BaseResponse>,
    next?: NextFunction
  ) {
    try {
      const sessionId = req.cookies?.[Constants.SESSION_COOKIE_NAME];
      if (!sessionId) {
        res
          .status(ResponseStatus.UNAUTHORIZED)
          .json({ message: "Unauthorized" });
        return;
      }

      const isAuthorized = await authorize(sessionId);
      if (!isAuthorized) {
        res.clearCookie(Constants.SESSION_COOKIE_NAME);
        await UserService.logout(sessionId);
        res
          .status(ResponseStatus.UNAUTHORIZED)
          .json({ message: "Session expired or invalid" });
        return;
      }

      if (!next) {
        res.status(ResponseStatus.SUCCESS).send();
        return;
      }

      next();
    } catch (err: any) {
      resServerError(res, err);
    }
  }

  static async checkAuth(req: Request, res: Response<EmptyResponse>) {
    try {
      await UserController.authMiddleware(req, res);
    } catch (err) {
      resServerError(res, err);
    }
  }
}
