import { PrismaClient } from "@prisma/client";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const upload = multer({ storage: multer.memoryStorage() });
export const prisma = new PrismaClient();

const apiInstance = axios.create({
  baseURL: process.env.JUDGE0_API_URL,
});

export const judgeApi = {
  get: async <T>(url: string) => {
    const res = await apiInstance.get<T>(url);
    return { status: res.status, body: res.data };
  },

  post: async <TResponse, TBody>(url: string, body: TBody) => {
    const res = await apiInstance.post<TResponse>(url, body);
    return { status: res.status, body: res.data };
  },

  put: async <TResponse, TBody>(url: string, body: TBody) => {
    const res = await apiInstance.put<TResponse>(url, body);
    return { status: res.status, body: res.data };
  },

  delete: async <T>(url: string) => {
    const res = await apiInstance.delete<T>(url);
    return { status: res.status, body: res.data };
  },
};
