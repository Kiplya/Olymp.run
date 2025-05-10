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

export type BaseResponse = {
  message: string;
};

export type EmptyResponse = {};
