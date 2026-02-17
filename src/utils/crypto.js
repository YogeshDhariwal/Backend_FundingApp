import crypto from "crypto";
import { ApiError } from "./ApiError.js";

const algorithm = "aes-256-gcm";

export function encrypt(text, secretKey) {
      if (!secretKey || Buffer.from(secretKey, "hex").length !== 32) {
  throw new ApiError(500, "Invalid PAYMENT_MASTER_KEY length");
}
  try {
  

    const iv = crypto.randomBytes(12); // GCM standard
    const cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    return {
      encryptedData: encrypted,
      iv: iv.toString("hex"),
      tag: authTag.toString("hex")
    };
  } catch {
    throw new ApiError(500, "Encryption failed");
  }
}


export function decrypt(data, secretKey) {
  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      Buffer.from(data.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(data.tag, "hex"));

    let decrypted = decipher.update(data.encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch {
    throw new ApiError(500, "Decryption failed");
  }
}

