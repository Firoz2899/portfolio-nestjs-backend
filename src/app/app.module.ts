import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { AppConfigurationModule } from '@config/config.module';
import { AppConfigService } from '@config/app-config.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ThrottlerModule } from '@nestjs/throttler';

//npm run start:dev
@Module({
  imports: [
    AppConfigurationModule,

    ThrottlerModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => [
        {
          ttl: 1000, // 1 second
          limit: config.rateLimitPerSecond  // maximum 100 requests per second
        },
        {
          ttl: 60 * 1000, // 1 minute
          limit: config.rateLimitPerMinute  // maximum 100 requests per minute
        },
        {
          ttl: 60 * 60 * 1000, // 1 hour
          limit: config.rateLimitPerHour  // maximum 100 requests per hour
        },
      ],
    }),

    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        uri: config.getMongoUri,
      }),
    }),

    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule { }