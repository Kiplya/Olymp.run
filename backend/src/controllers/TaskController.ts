import {
  BaseResponse,
  ResponseStatus,
  TaskCreationRequest,
  TaskDeletionRequest,
  TaskGetResponse,
  TaskDifficulties,
} from "@shared/apiTypes";
import { Request, Response } from "express";
import { resServerError } from "../utils/common";
import TaskService from "../services/TaskService";

export default class TaskController {
  static async create(
    req: Request<{}, {}, TaskCreationRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      const testsFile = req.file;
      if (!testsFile) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: "Missing testsFile" });
        return;
      }

      await TaskService.create(req.body, testsFile);
      res.sendStatus(ResponseStatus.NO_CONTENT);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async deleteByTitle(
    req: Request<{}, {}, TaskDeletionRequest>,
    res: Response<BaseResponse>
  ) {
    try {
      const isDeleted = await TaskService.deleteByTitle(req.body.title);
      if (!isDeleted) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .json({ message: `Task with title ${req.body.title} not found` });
        return;
      }

      res.sendStatus(ResponseStatus.NO_CONTENT);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async getByDiffAndTitle(
    req: Request,
    res: Response<TaskGetResponse[] | BaseResponse>
  ) {
    try {
      const { title, difficulty, limit } = req.query;

      if (!title || !difficulty || !limit || isNaN(Number(limit))) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .send({ message: "Title, difficulty and limit are required" });
        return;
      }

      if (
        difficulty !== TaskDifficulties.EASY &&
        difficulty !== TaskDifficulties.MEDIUM &&
        difficulty !== TaskDifficulties.HARD
      ) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .send({ message: "Invalid difficulty value" });
        return;
      }

      const tasks = await TaskService.getByDiffAndTitle(
        title.toString(),
        difficulty,
        Number(limit)
      );

      const tasksInfo: TaskGetResponse[] = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        difficulty: task.difficulty,
      }));

      res.status(ResponseStatus.SUCCESS).send(tasksInfo);
    } catch (err) {
      resServerError(res, err);
    }
  }

  static async getByTitle(
    req: Request,
    res: Response<TaskGetResponse[] | BaseResponse>
  ) {
    try {
      const { title, limit } = req.query;
      if (!title || !limit || isNaN(Number(limit))) {
        res
          .status(ResponseStatus.INVALID_CREDENTIALS)
          .send({ message: "Title and limit are required" });
        return;
      }

      const tasks = await TaskService.getByTitle(
        title.toString(),
        Number(limit)
      );
      const tasksInfo: TaskGetResponse[] = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        difficulty: task.difficulty,
      }));

      res.status(ResponseStatus.SUCCESS).send(tasksInfo);
    } catch (err) {
      resServerError(res, err);
    }
  }
}
