import crypto from "crypto";

export const generateUniqueCode = (prefix = "GEN") => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Format: YYYYMMDD (recommended)
  const datePart = `${year}${month}${day}`;

  // 8-character random uppercase hex suffix
  const uniqueSuffix = crypto.randomBytes(5).toString("hex").toUpperCase();

  return `${prefix}-${datePart}-${uniqueSuffix}`;
}
