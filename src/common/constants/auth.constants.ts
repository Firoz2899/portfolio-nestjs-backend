export enum PasswordResetMethod {
    LINK = 'LINK',
    OTP = 'OTP',
    BOTH = 'BOTH',
}

export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum TokenType {
    ACCESS = "access",
    REFRESH = "refresh",
    EMAIL_VERIFICATION = "email-verification",
    PASSWORD_RESET = "password-reset",
}

export enum ClientType {
    WEB = "web",
    MOBILE = "mobile",
    ADMIN = "admin",
}

export enum HttpCookies {
    AccessToken = "accessToken",
    RefreshToken = "refreshToken"
}
