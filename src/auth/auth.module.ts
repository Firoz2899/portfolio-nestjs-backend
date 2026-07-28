import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@/auth/services/auth.service';
import { TokenService } from '@/auth/services/token.service';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';

import { UserModule } from '@user/user.module';

import { AppConfigurationModule } from '@config/config.module';
import { AppConfigService } from '@config/app-config.service';

import { CookieService } from '@/common/cookie/cookie.service';
import { UserMapper } from '@/common/mappers/user.mapper';
import {EmailModule} from '@email/email.module'

@Module({
  imports: [
    UserModule,
    
    JwtModule.registerAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.accessTokenSecret,
        signOptions: {
          expiresIn: config.accessTokenExpiry,
        },
      }),
    }),
    
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    CookieService,
    JwtStrategy,
    UserMapper
  ]
})
export class AuthModule {}
