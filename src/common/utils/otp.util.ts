import bcrypt from "bcryptjs";

export const generateOTP = async (expiryMin: number) => {
  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const hashedOtp = await bcrypt.hash(otp, 10);

  const expiresAt = new Date(Date.now() + (expiryMin * 60 * 1000));

  return {
    otp,
    hashedOtp,
    expiresAt
  }
};

export const compareOtp = async (actualOtp: string, hashedOtp: string) => {
  return await bcrypt.compare(actualOtp, hashedOtp);
}