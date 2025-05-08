import bcrypt from "bcryptjs";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 12;
const SALT_ROUNDS = 10;

export const encrypt = (data: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(data, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
};

export const decrypt = (encryptedData: string) => {
  const bufferData = Buffer.from(encryptedData, "base64");
  const iv = bufferData.subarray(0, IV_LENGTH);
  const authTag = bufferData.subarray(IV_LENGTH, IV_LENGTH + 16);
  const encrypted = bufferData.subarray(IV_LENGTH + 16);

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};

export const hash = async (data: string) => {
  const hashedData = await bcrypt.hash(data, SALT_ROUNDS);
  return hashedData;
};
