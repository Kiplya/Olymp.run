import { Request, Response } from "express";
import ContestService from "../services/ContestService";
import { resServerError } from "../utils/common";
import { user } from "@prisma/client";
import {
  AddParticipantInContestRequest,
  BaseResponse,
  ContestCreationRequest,
  ContestCreationResponse,
  ContestDeletionRequest,
  ContestGetByParticipantResponse,
  EmptyResponse,
  RemoveParticipantFromContestRequest,
  ResponseStatus,
} from "@shared/apiTypes";

export default class ContestController {
  static async create(
    req: Request<{}, {}, ContestCreationRequest>,
    res: Response<ContestCreationResponse | BaseResponse>
  ) {
    try {
      if (req.body.participantsCount <= 0) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Participants count must be higher than 0" });
        return;
      }

      const nowDate = new Date();
      if (nowDate >= req.body.endTime || nowDate >= req.body.startTime) {
        res.status(ResponseStatus.INVALID_CREDENTIALS).json({
          message: "Start and end time must be in the future",
        });
        return;
      }

      if (req.body.startTime >= req.body.endTime) {
        res.status(ResponseStatus.INVALID_CREDENTIALS).json({
          message: "Start time must be before end time",
        });
        return;
      }

      const users = await ContestService.create(req.body);
      const usersJson = JSON.stringify(users, null, 2)
      res.status(ResponseStatus.SUCCESS).json(usersJson);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async deleteByTitle(
    req: Request<{}, {}, ContestDeletionRequest>,
    res: Response<BaseResponse | EmptyResponse>
  ) {
    try {
      const isDeleted = await ContestService.deleteByTitle(req.body.title);

      if (!isDeleted) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: `Contest with title ${req.body.title} not found` });
        return;
      }

      res.sendStatus(ResponseStatus.NO_CONTENT);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async getByParticipant(
    req: Request & { user?: user },
    res: Response<
      ContestGetByParticipantResponse | BaseResponse | EmptyResponse
    >
  ) {
    try {
      const contests = await ContestService.getByParticipant(req?.user?.id!);
      if (!contests) {
        res.sendStatus(ResponseStatus.NO_CONTENT);
        return;
      }

      res.status(ResponseStatus.SUCCESS).json(contests);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async addParticipant(
    req: Request<{}, {}, AddParticipantInContestRequest>,
    res: Response<BaseResponse | EmptyResponse>
  ) {
    try {
      const isAdded = await ContestService.addParticipant(req.body);
      if (!isAdded) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "User or contest not found" });
        return;
      }

      res.sendStatus(ResponseStatus.NO_CONTENT);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async removeParticipant(
    req: Request<{}, {}, RemoveParticipantFromContestRequest>,
    res: Response<BaseResponse | EmptyResponse>
  ) {
    try {
      const isRemoved = await ContestService.removeParticipant(req.body);
      if (!isRemoved) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "User or contest not found" });
        return;
      }

      res.sendStatus(ResponseStatus.NO_CONTENT);
    } catch (err) {
      resServerError(res, err);
    }
  }
}
