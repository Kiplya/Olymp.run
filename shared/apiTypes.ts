export const ResponseStatus = {
  INTERNAL_SERVER_ERROR: 500,
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  INVALID_CREDENTIALS: 400,
  NO_CONTENT: 204,
} as const;

export const Endpoints = {
  REGISTRATION: { method: "post", apiUrl: "/registration" },
  LOGIN: { method: "post", apiUrl: "/login" },
  LOGOUT: { method: "post", apiUrl: "/logout" },
  AUTH: { method: "get", apiUrl: "/auth" },
} as const;

export type LoginRequest = {
  login: string;
  password: string;
};

export type BaseResponse = {
  message: string;
};

export type EmptyResponse = {};
