import { NextFunction, Request, Response } from "express";
import ContestService from "../services/ContestService";
import { resServerError } from "../utils/common";
import { user } from "@prisma/client";
import {
  AddParticipantInContestRequest,
  BaseResponse,
  ContestCreationRequest,
  ContestCreationResponse,
  ContestDeletionRequest,
  ContestGetInfoResponse,
  ContestGetManyByParticipantResponse,
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
      const usersJson = JSON.stringify(users, null, 2);
      res.status(ResponseStatus.SUCCESS).json(usersJson);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async deleteByTitle(
    req: Request<{}, {}, ContestDeletionRequest>,
    res: Response<BaseResponse>
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

  static async getManyByParticipant(
    req: Request & { user?: user },
    res: Response<ContestGetManyByParticipantResponse | BaseResponse>
  ) {
    try {
      const contests = await ContestService.getManyByParticipant(
        req?.user?.id!
      );
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
    res: Response<BaseResponse>
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
    res: Response<BaseResponse>
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

  static async getInfo(
    req: Request & { query: { contestId?: string }; user?: user },
    res: Response<ContestGetInfoResponse | BaseResponse>
  ) {
    try {
      const userId = req?.user?.id!;
      const contestId = req.query?.contestId!;

      const contestInfo = await ContestService.getInfo(contestId, userId);
      if (!contestInfo) {
        res.sendStatus(ResponseStatus.NO_CONTENT);
        return;
      }

      res.status(ResponseStatus.SUCCESS).json(contestInfo);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async participationMiddleware(
    req: Request & { user?: user },
    res: Response<BaseResponse>,
    next: NextFunction
  ) {
    try {
      const userId = req?.user?.id!;
      const contestId = req.query?.contestId;

      if (!contestId) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Contest not specified" });
        return;
      }

      const participant = await ContestService.getOneByParticipant(
        userId,
        contestId.toString()
      );

      if (!participant) {
        res
          .status(ResponseStatus.FORBIDDEN)
          .json({ message: "You are not participating in this contest" });
        return;
      }

      next();
    } catch (err) {
      resServerError(res, err);
    }
  }
}
