import { BaseResponse, ResponseStatus } from "@shared/apiTypes";
import { Response } from "express";

export const resServerError = (res: Response<BaseResponse>, err: any) => {
  console.error(err);
  res
    .status(ResponseStatus.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error" });
};
