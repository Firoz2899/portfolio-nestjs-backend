import { Injectable, HttpStatus } from '@nestjs/common';

import { UserService } from '@user/user.service';
import { TokenService } from '@auth/services/token.service';
import { EmailService } from '@/email/email.service';

import { ApiException } from '@common/exceptions/api-exception';
import { ErrorTypes } from '@common/constants/common.constants';
import { ClientType } from '@common/constants/auth.constants';

import { generateOTP, compareOtp } from '@common/utils/otp.util';

import { ForgotPasswordDto, ResetPasswordDto } from '@auth/dto/password-reset.dto';
import { VerifyTokenPayload } from '@auth/interface/auth-tokens.interface';


@Injectable()
export class PasswordResetService {

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

}