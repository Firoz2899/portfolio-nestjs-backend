import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '@config/app-config.service';
import { UserService } from '@user/user.service';

import { JwtPayload } from '@auth/interface/jwt-payload.interface';
import { ErrorTypes } from '@/common/constants/common.constants';
import { ApiException } from '@/common/exceptions/api-exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req?.cookies?.AccessToken,
      ]),

      ignoreExpiration: false,

      secretOrKey: config.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user =
      await this.userService.findByUniqueCode(payload.sub);

    if (!user || !user.IsActive || !user.IsEmailVerified) {
        throw new ApiException(
          HttpStatus.UNAUTHORIZED,
          ErrorTypes.INVALID_TOKEN,
          'Invalid or expired access token.',
        );
    }

    return user;
  }
}