import { BaseResponse, ResponseStatus } from "@shared/apiTypes";
import { Response } from "express";
import { Judge0ResponseStatus } from "../controllers/ContestController";

export const resServerError = (res: Response<BaseResponse>, err: any) => {
  console.error(err);
  res
    .status(ResponseStatus.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error" });
};

export const getJudge0StatusKey = (
  value: number
): keyof typeof Judge0ResponseStatus => {
  return Object.keys(Judge0ResponseStatus).find(
    (key) =>
      Judge0ResponseStatus[key as keyof typeof Judge0ResponseStatus] === value
  ) as keyof typeof Judge0ResponseStatus;
};
