import { ClientType, Roles, TokenType } from "@/common/constants/auth.constants";
import { UserDocument } from "@/user/interfaces/user.interface";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  hashedRefreshToken: string;
}

export interface AccessTokenPayload {
    sub: string;
    email: string;
    role: Roles[];
    client: ClientType;
    type: TokenType.ACCESS;
}

export interface RefreshTokenPayload {
    sub: string;
    client: ClientType;
    type: TokenType.REFRESH;
}

export interface TokenOptions {
    user: UserDocument;
    clientType: ClientType;
}

export interface VerifyTokenPayload {
  token: string;
  clientType: ClientType
}