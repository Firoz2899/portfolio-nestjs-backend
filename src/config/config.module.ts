import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from '@config/app-config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigurationModule {}