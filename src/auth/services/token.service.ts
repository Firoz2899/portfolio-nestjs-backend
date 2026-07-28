import { AppConfigService } from '@/config/app-config.service';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '@auth/interface/jwt-payload.interface';
import { AuthTokens, TokenOptions, VerifyTokenPayload } from '@auth/interface/auth-tokens.interface';
import { TokenType } from '@/common/constants/auth.constants';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: AppConfigService,
  ) {}

  createAccessToken(options: TokenOptions): string {
    const payload = {
      sub: options.user.UniqueCode,
      email: options.user.Email,
      role: options.user.Role,
      type: TokenType.ACCESS,
      client: options.clientType,
    };
    return this.sign(payload, {
      secret: this.config.accessTokenSecret,
      expiresIn: this.config.accessTokenExpiry,
      audience: options.clientType
    });
  }

  createPasswordResetToken(options: TokenOptions): string {
    const payload = {
      sub: options.user.UniqueCode,
      type: TokenType.PASSWORD_RESET
    };

    return this.sign(payload, {
      secret: this.config.passwordResetTokenSecret,
      expiresIn: this.config.passwordResetTokenExpiry,
      audience: options.clientType
    });
  }

  verifyPasswordResetToken(dto: VerifyTokenPayload): JwtPayload | null {
    try {
      return this.verify<JwtPayload>(dto.token, {
        secret: this.config.passwordResetTokenSecret,
        audience: dto.clientType,
      });
    }
    catch {
      return null;
    }
  }

  createRefreshToken(options: TokenOptions): string {
    const payload = {
      sub: options.user.UniqueCode,
      email: options.user.Email,
      role: options.user.Role,
      type: TokenType.REFRESH
    };
    return this.sign(payload, {
      secret: this.config.refreshTokenSecret,
      expiresIn: this.config.refreshTokenExpiry,
      audience: options.clientType
    });
  }

  async hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  async compareRefreshToken(
    token: string,
    hashedToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(token, hashedToken);
  }

  verifyRefreshToken(dto: VerifyTokenPayload): JwtPayload | null  {
    try{
      return this.verify<JwtPayload>(dto.token, {
        secret: this.config.refreshTokenSecret,
        audience: dto.clientType
      });
    }
    catch {
      return null;
    }
  }

  async generateTokens(options: TokenOptions): Promise<AuthTokens> {
    const accessToken = this.createAccessToken(options);
    const refreshToken = this.createRefreshToken(options);
    const hashedRefreshToken = await this.hashRefreshToken(refreshToken);
    return {
      accessToken,
      refreshToken,
      hashedRefreshToken
    }
  }

  private sign<T extends object>(
    payload: T,
    options: JwtSignOptions,
  ): string {
      return this.jwtService.sign(payload, {...options, issuer: this.config.issuer});
  }

  private verify<T extends object>(
    payload: string,
    options: JwtVerifyOptions,
  ): T {
    return this.jwtService.verify<T>(payload, {...options, issuer: this.config.issuer});
  }
}