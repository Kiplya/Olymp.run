export const ResponseStatus = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INVALID_CREDENTIALS: 400,
  NO_CONTENT: 204,
} as const;

export type LoginRequest = {
  login: string;
  password: string;
};

export type RegistrationRequest = LoginRequest;
export type RegistrationResponse = LoginRequest;

export type UserDeleteByLoginRequest = {
  login: string;
};

export type BaseResponse = {
  message: string;
};

export const TaskDifficulties = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;

export type TypeTaskDifficulty =
  (typeof TaskDifficulties)[keyof typeof TaskDifficulties];

export type TaskCreationRequest = {
  taskName: string;
  taskDescription: string;
  taskMemoryLimit: string;
  taskTimeLimit: string;
  taskInputExample: string;
  taskOutputExample: string;
  taskDifficulty: TypeTaskDifficulty;
};

export type TaskDeletionRequest = {
  title: string;
};

export type TaskTest = {
  input: string;
  expectedOutput: string;
};

export type TaskGetResponse = {
  id: string;
  title: string;
  difficulty: TypeTaskDifficulty;
};

export type TaskGetRequest = {
  title: string;
  difficulty?: TypeTaskDifficulty;
  limit: number;
};

export type ContestCreationRequest = {
  title: string;
  startTime: Date;
  endTime: Date;
  participantsCount: number;
  tasksId: string[];
};

export type ContestCreationResponse = string;

export type ContestDeletionRequest = TaskDeletionRequest;

export type ContestGetManyByParticipantResponse = {
  id: string;
  title: string;
  startTime: string | Date;
  endTime: string | Date;
}[];

export type AddParticipantInContestRequest = {
  userLogin: string;
  contestTitle: string;
};

export type RemoveParticipantFromContestRequest =
  AddParticipantInContestRequest;

export type ContestGetInfoResponse = {
  title: string;
  endTime: string | Date;

  participants: { score: number }[];

  tasks: {
    order: number;
    participantTasks: { score: number }[];
    task: {
      id: string;
      title: string;
      description: string;
      exampleInput: string;
      exampleOutput: string;
      timeLimit: number;
      memoryLimit: number;
      difficulty: TypeTaskDifficulty;
    };
  }[];
};

export type ContestGetInfoRequest = {
  contestId: string;
};

export const MAX_SCORE_FOR_TASK = 100;

export const AllowedCompilers = {
  54: "C++ (GCC 9.2.0)",
  50: "C (GCC 9.2.0)",
  62: "Java (OpenJDK 13.0.1)",
  63: "JavaScript (Node.js 12.14.0)",
  78: "Kotlin (1.3.70)",
  71: "Python (3.8.1)",
  73: "Rust (1.40.0)",
} as const;

export type TypeAllowedCompilers =
  (typeof AllowedCompilers)[keyof typeof AllowedCompilers];
