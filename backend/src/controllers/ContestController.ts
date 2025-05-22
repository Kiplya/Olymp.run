import { NextFunction, Request, Response } from "express";
import ContestService from "../services/ContestService";
import TaskService from "../services/TaskService";
import { getJudge0StatusKey, resServerError } from "../utils/common";
import { judgeApi } from "../handlers";
import { user } from "@prisma/client";
import {
  AddParticipantInContestRequest,
  BaseResponse,
  ContestCreationRequest,
  ContestCreationResponse,
  ContestDeletionRequest,
  ContestGetInfoResponse,
  ContestGetManyByParticipantResponse,
  MAX_SCORE_FOR_TASK,
  RemoveParticipantFromContestRequest,
  ResponseStatus,
  SolutionSubmitRequest,
  SolutionSubmitResponse,
  TypeAllowedCompilerIds,
} from "@shared/apiTypes";

type Judge0Response = {
  status?: { id: number; description: string };
  error?: string;
};

type Judge0Request = {
  source_code: string;
  language_id: TypeAllowedCompilerIds;
  stdin: string;
  expected_output: string;
  cpu_time_limit: number;
  memory_limit: number;
};

export const Judge0ResponseStatus = {
  Accepted: 3,
  "Wrong Answer": 4,
  "Time Limit Exceeded": 5,
  "Runtime Error": 6,
  "Memory Limit Exceeded": 7,
  "Output Limit Exceeded": 8,
  "Compilation Error": 11,
  "Internal Error": 13,
} as const;

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

  static async solutionSubmit(
    req: Request<{}, {}, SolutionSubmitRequest> & {
      query: { contestId?: string };
      user?: user;
    },
    res: Response<SolutionSubmitResponse | BaseResponse>
  ) {
    try {
      const taskId = req.query?.taskId;
      if (!taskId) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Task not specified" });
        return;
      }

      const task = await TaskService.getById(taskId.toString());

      if (!task) {
        throw new Error(`Task with id ${taskId} not found`);
      }

      const isInContestTask = await ContestService.isInContestTask(
        req?.query?.contestId!,
        taskId.toString()
      );

      if (!isInContestTask) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Task isn't in contest" });
        return;
      }

      const isCompletedContestTask =
        await ContestService.isCompletedContestTask(
          req?.query?.contestId!,
          taskId.toString(),
          req.user?.id!
        );

      if (isCompletedContestTask) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Task is completed" });
        return;
      }

      const testsCount = task.tests.length;
      const input =
        `${testsCount}\n` +
        task.tests.map((test) => test.input.trim()).join("\n");
      const expectedOutput = task.tests
        .map((test) => test.expectedOutput.trim())
        .join("\n");

      const sumbission = await judgeApi.post<Judge0Response, Judge0Request>(
        "/submissions?base64_encoded=false&wait=true",
        {
          source_code: req.body.solution,
          language_id: req.body.compiler,
          stdin: input,
          expected_output: expectedOutput,
          cpu_time_limit: task.timeLimit / 1000,
          memory_limit: task.memoryLimit * 1000,
        }
      );

      if (!sumbission.body.status) {
        await ContestService.upsertContestParticipantTask(
          req?.query?.contestId!,
          taskId.toString(),
          req.user?.id!,
          0
        );

        res.status(ResponseStatus.SUCCESS).json({
          score: 0,
          message: getJudge0StatusKey(
            Judge0ResponseStatus["Compilation Error"]
          ),
        });
      } else if (
        sumbission.body.status.id === Judge0ResponseStatus["Accepted"]
      ) {
        await ContestService.upsertContestParticipantTask(
          req?.query?.contestId!,
          taskId.toString(),
          req.user?.id!,
          MAX_SCORE_FOR_TASK
        );

        await ContestService.incrementParticipantScore(
          req?.query?.contestId!,
          req.user?.id!,
          MAX_SCORE_FOR_TASK
        );

        res.status(ResponseStatus.SUCCESS).json({
          score: MAX_SCORE_FOR_TASK,
          message: getJudge0StatusKey(sumbission.body.status.id),
        });
      } else if (
        sumbission.body.status.id === Judge0ResponseStatus["Internal Error"]
      ) {
        throw new Error("Judge0 Internal Error");
      } else {
        await ContestService.upsertContestParticipantTask(
          req?.query?.contestId!,
          taskId.toString(),
          req.user?.id!,
          0
        );

        res.status(ResponseStatus.SUCCESS).json({
          score: 0,
          message: getJudge0StatusKey(sumbission.body.status.id),
        });
      }
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

      const contestTimes = await ContestService.getByContestId(
        contestId.toString()
      );

      if (!contestTimes) {
        throw new Error(`Times in contest with id ${contestId} not specified`);
      }

      const { startTime, endTime } = contestTimes;
      if (new Date() < startTime || new Date() > endTime) {
        res.status(ResponseStatus.FORBIDDEN).json({
          message: "Access to this contest isn't allowed at the current time",
        });
        return;
      }

      next();
    } catch (err) {
      resServerError(res, err);
    }
  }
}
