import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { AppConfigurationModule } from '@config/config.module';
import { AppConfigService } from '@config/app-config.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

//npm run start:dev
@Module({
  imports: [
    AppConfigurationModule,

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