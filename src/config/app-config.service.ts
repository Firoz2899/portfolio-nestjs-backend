import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  //#region  Basic
  get isProduction(): boolean {
    return this.config.get('NODE_ENV') === 'production';
  }

  get port(): number {
    return Number(this.config.get('PORT'));
  }
  //#endregion Basic

  //#region Database
  get dbUserName(): string {
    return this.config.get<string>('DB_USERNAME')!;
  }

  get dbPassword(): string {
    return this.config.get<string>('DB_PASSWORD')!;
  }

  get dbName(): string {
    return this.config.get<string>('DB_NAME')!;
  }

  get dbClusterName(): string {
    return this.config.get<string>('DB_CLUSTER_NAME')!;
  }

  get dbClusterNameSuffix(): string {
    return this.config.get<string>('DB_CLUSTER_NAME_SUFFIX')!;
  }
  
  // resolved properties
  get getMongoUri(): string {
    if (!this.isProduction) {
      return `mongodb://localhost:27017/${this.dbName}`;
    }

    return `mongodb+srv://${encodeURIComponent(this.dbUserName)}:${encodeURIComponent(this.dbPassword)}@${this.dbClusterName}.${this.dbClusterNameSuffix}.mongodb.net/${this.dbName}`;
  }
  //#endregion Database

  //#region JWT
  get issuer(): string {
    return this.config.get<string>('ISSUER')!;
  }

  get accessTokenSecret(): string {
    return this.config.get<string>('ACCESS_TOKEN_SECRET')!;
  }

  get accessTokenExpiry(): StringValue {
    return this.config.get<StringValue>('ACCESS_TOKEN_EXPIRES_IN') || "1h";
  }

  get refreshTokenSecret(): string {
    return this.config.get<string>('REFRESH_TOKEN_SECRET')!;
  }

  get refreshTokenExpiry(): StringValue {
    return this.config.get<StringValue>('REFRESH_TOKEN_EXPIRES_IN') || "1d";
  }

  get passwordResetOtpExpiry(): number {
    return Number(this.config.get<number>("PASSWORD_RESET_OTP_EXPIRY_MINUTES"));
  }

  get passwordResetTokenExpiry(): StringValue {
    return this.config.get<StringValue>("PASSWORD_RESET_TOKEN_EXPIRY") || "15m";
  }

  get passwordResetTokenSecret(): string {
    return this.config.get<string>("PASSWORD_RESET_TOKEN_SECRET")!;
  }
  //#endregion JWT

  //#region  SMTP
  get smtpHost(): string {
    return this.config.get<string>('SMTP_HOST')!;
  }

  get smtpPort(): number {
    return Number(this.config.get<number>('SMTP_PORT'));
  }

  get smtpSecure(): boolean {
    return this.config.get<boolean>('SMTP_SECURE') || false;
  }

  get smtpUser(): string {
    return this.config.get<string>('SMTP_USER')!;
  }

  get smtpPassword(): string {
    return this.config.get<string>('SMTP_PASS')!;
  }

  get smtpFrom(): string {
    return this.config.get<string>('SMTP_FROM')!;
  }
  //#endregion SMTP

  //#region  Email Context
  get appName(): string {
    return this.config.get<string>("APP_NAME")!;
  }

  get appUrl(): string {
    return this.config.get<string>("APP_URL")!;
  }

  get supportEmail(): string {
    return this.config.get<string>("SUPPORT_EMAIL")!;
  }

  get emailVerificationOtpExpiryMinutes(): number {
    return Number(this.config.get("EMAIL_VERIFICATION_OTP_EXPIRY_MINUTES"));
  }
  //#endregion Email Context
}