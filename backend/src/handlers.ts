import { PrismaClient } from "@prisma/client";
import multer from "multer";

export const upload = multer({ storage: multer.memoryStorage() });

export const prisma = new PrismaClient();
