import {
  TaskCreationRequest,
  TaskTest,
  TypeTaskDifficulty,
} from "@shared/apiTypes";
import { prisma } from "../handlers";

export default class TaskService {
  static async create(
    task: TaskCreationRequest,
    testsFile: Express.Multer.File
  ) {
    const memoryLimit = parseInt(task.taskMemoryLimit);
    const timeLimit = parseInt(task.taskTimeLimit);

    if (isNaN(memoryLimit) || isNaN(timeLimit)) {
      throw new Error("Invalid time or memory limits");
    }

    const jsonStr = testsFile.buffer.toString("utf-8");
    let tests: TaskTest[];

    try {
      tests = JSON.parse(jsonStr);
    } catch {
      throw new Error("Invalid JSON in testsFile");
    }

    for (const [i, test] of tests.entries()) {
      if (
        typeof test.input !== "string" ||
        typeof test.expectedOutput !== "string"
      ) {
        throw new Error(`Invalid test at index ${i}`);
      }
    }

    await prisma.$transaction(async (tx) => {
      const createdTask = await tx.task.create({
        data: {
          title: task.taskName,
          description: task.taskDescription,
          exampleInput: task.taskInputExample,
          exampleOutput: task.taskOutputExample,
          timeLimit,
          memoryLimit,
          difficulty: task.taskDifficulty,
        },
      });

      const taskTestsData = tests.map((test, index) => ({
        order: index,
        input: test.input,
        expectedOutput: test.expectedOutput,
        taskId: createdTask.id,
      }));

      await tx.taskTest.createMany({
        data: taskTestsData,
      });
    });
  }

  static async deleteByTitle(title: string) {
    const task = await prisma.task.findUnique({
      where: { title },
    });

    if (!task) {
      return false;
    }

    await prisma.task.delete({
      where: { id: task.id },
    });
    return true;
  }

  static async getByDiffAndTitle(
    title: string,
    difficulty: TypeTaskDifficulty,
    limit: number
  ) {
    return await prisma.task.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
        difficulty: difficulty,
      },
      take: limit,
    });
  }

  static async getByTitle(title: string, limit: number) {
    return await prisma.task.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      take: limit,
    });
  }

  static async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { tests: { orderBy: { order: "asc" } } },
    });

    if (!task?.tests.length) {
      throw new Error("No tests found for this task");
    }

    return task;
  }
}
