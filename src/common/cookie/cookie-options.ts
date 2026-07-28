import { CookieOptions } from 'express';

export const getCookieOptions = (
  rememberMe = false,
): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: rememberMe
    ? 1000 * 60 * 60 * 24 * 30 // 30 days
    : undefined,
});