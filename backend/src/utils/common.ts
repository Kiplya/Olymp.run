import { BaseResponse, ResponseStatus, LoginRequest } from "@shared/apiTypes";
import { Response, Request } from "express";

export const resServerError = (res: Response, err: any) => {
  console.error(err);
  res
    .status(ResponseStatus.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error" });
};

export const loginDataValidation = (
  req: Request<{}, {}, LoginRequest>,
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
