import {
  AddParticipantInContestRequest,
  ContestCreationRequest,
  RegistrationRequest,
  RemoveParticipantFromContestRequest,
} from "@shared/apiTypes";
import { prisma } from "../handlers";
import { generateRandomPassword, generateRandomLogin } from "../utils/user";
import { hash } from "../utils/crypt";

export default class ContestService {
  static async create(contestData: ContestCreationRequest) {
    const { title, startTime, endTime, participantsCount, tasksId } =
      contestData;

    const newUsers: RegistrationRequest[] = Array.from({
      length: participantsCount,
    }).map(() => ({
      login: `user_${generateRandomLogin()}`,
      password: generateRandomPassword(),
    }));

    await prisma.$transaction(async (tx) => {
      const contest = await tx.contest.create({
        data: {
          title,
          startTime: startTime,
          endTime: endTime,
        },
      });

      await tx.contestTask.createMany({
        data: tasksId.map((taskId, index) => ({
          contestId: contest.id,
          taskId,
          order: index,
        })),
      });

      const createdUsers = await Promise.all(
        newUsers.map(async (user) =>
          tx.user.create({
            data: { login: user.login, password: await hash(user.password) },
          })
        )
      );

      await tx.contestParticipant.createMany({
        data: createdUsers.map((user) => ({
          contestId: contest.id,
          userId: user.id,
        })),
      });
    });

    return newUsers;
  }

  static async deleteByTitle(title: string) {
    const contest = await prisma.contest.findUnique({ where: { title } });

    if (!contest) {
      return false;
    }

    await prisma.contest.delete({ where: { id: contest.id } });
    return true;
  }

  static async getManyByParticipant(userId: string) {
    const contests = await prisma.contest.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
    });

    return contests;
  }

  static async getOneByParticipant(userId: string, contestId: string) {
    const participant = await prisma.contestParticipant.findUnique({
      where: {
        userId_contestId: {
          userId,
          contestId,
        },
      },
    });

    return participant;
  }

  static async getInfo(contestId: string, userId: string) {
    const contestInfo = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
      select: {
        title: true,
        endTime: true,
        participants: {
          where: { userId, contestId },
          select: { score: true },
        },
        tasks: {
          select: {
            order: true,
            task: {
              select: {
                id: true,
                title: true,
                description: true,
                difficulty: true,
                exampleInput: true,
                exampleOutput: true,
                timeLimit: true,
                memoryLimit: true,
              },
            },
            participantTasks: {
              where: { userId, contestId },
              select: {
                score: true,
              },
            },
          },
        },
      },
    });

    return contestInfo;
  }

  static async addParticipant({
    userLogin,
    contestTitle,
  }: AddParticipantInContestRequest) {
    const [user, contest] = await Promise.all([
      prisma.user.findUnique({ where: { login: userLogin } }),
      prisma.contest.findFirst({
        where: {
          title: {
            equals: contestTitle,
            mode: "insensitive",
          },
        },
      }),
    ]);

    if (!user || !contest) {
      return false;
    }

    await prisma.contestParticipant.create({
      data: { userId: user.id, contestId: contest.id },
    });

    return true;
  }

  static async removeParticipant({
    userLogin,
    contestTitle,
  }: RemoveParticipantFromContestRequest) {
    const [user, contest] = await Promise.all([
      prisma.user.findUnique({ where: { login: userLogin } }),
      prisma.contest.findUnique({ where: { title: contestTitle } }),
    ]);

    if (!user || !contest) {
      return false;
    }

    await prisma.contestParticipant.delete({
      where: {
        userId_contestId: {
          userId: user.id,
          contestId: contest.id,
        },
      },
    });

    return true;
  }

  static async getByContestId(contestId: string) {
    return await prisma.contest.findUnique({
      where: { id: contestId },
      select: { startTime: true, endTime: true },
    });
  }
}
