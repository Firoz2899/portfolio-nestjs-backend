import {  HttpStatus, Injectable } from '@nestjs/common';

import { UserService } from '@user/user.service';
import {RegisterDto, LoginDto} from '@auth/dto/auth.dto'
import { ApiException } from '@common/exceptions/api-exception';
import {ErrorTypes} from '@common/constants/common.constants'
import {ClientType} from '@common/constants/auth.constants'
import { TokenService } from '@/auth/services/token.service';
import { UserDocument } from '@/user/interfaces/user.interface';
import { generateOTP } from '@/common/utils/otp.util';
import { VerifyTokenPayload } from '@auth/interface/auth-tokens.interface';
import { EmailService } from '@/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<string | null> {
    const existingUser = await this.userService.findByEmail(
     registerDto.Email,
    );

    if (existingUser) {
        throw new ApiException(
            HttpStatus.CONFLICT, 
            ErrorTypes.EMAIL_ALREADY_EXISTS, 
            'Email already exists'
        );
    }

    const {otp, hashedOtp, expiresAt} = await generateOTP(10)

    await this.userService.create({
        FirstName: registerDto.FirstName,
        LastName: registerDto.LastName,
        Email: registerDto.Email,
        Password: registerDto.Password,
        EmailVerificationOTP: hashedOtp,
        EmailVerificationOTPExpiresAt: expiresAt,
    });

    await this.emailService.sendVerificationEmail({
        email: registerDto.Email,
        firstName: registerDto.FirstName,
        otp
    });

    // will add welcome email later

    return registerDto.Email;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(
        loginDto.Email,
    );

    if (!user) {
        throw new ApiException(
            HttpStatus.UNAUTHORIZED, 
            ErrorTypes.INVALID_CREDENTIALS, 
            'Invalid credentials'
        );
    }

    const isPasswordValid = await user.comparePassword(loginDto.Password);

    if (!isPasswordValid) {
        throw new ApiException(
            HttpStatus.UNAUTHORIZED, 
            ErrorTypes.INVALID_CREDENTIALS, 
            'Invalid credentials'
        );
    }

    if (!user.IsActive) {
        throw new ApiException(
            HttpStatus.FORBIDDEN, 
            ErrorTypes.ACCESS_DENIED, 
            'Account has been disabled'
        );
    }

    if (!user.IsEmailVerified) {
        throw new ApiException(
            HttpStatus.FORBIDDEN, 
            ErrorTypes.EMAIL_NOT_VERIFIED, 
            'Please verify your email first'
        );
    }

    const tokens = await this.createSession(user, loginDto.RememberMe, loginDto.ClientType);

    return {
        tokens,
        user: {
            UniqueCode: user.UniqueCode,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Roles: user.Role,
        },
    };
  }

  async refresh(dto: VerifyTokenPayload) {

    if (!dto.token) {
        throw new ApiException(
            HttpStatus.UNAUTHORIZED,
            ErrorTypes.REFRESH_TOKEN_INVALID_OR_EXPIRED,
            'Refresh token is required',
        );
    }

    const payload = this.tokenService.verifyRefreshToken(dto);

    if(!payload){
        throw new ApiException(
            HttpStatus.UNAUTHORIZED,
            ErrorTypes.REFRESH_TOKEN_INVALID_OR_EXPIRED,
            'Invalid refresh token',
        );
    }

    const user = await this.userService.findByUniqueCode(payload.sub);

    if (!user || !user.RefreshToken) {
        throw new ApiException(
            HttpStatus.UNAUTHORIZED,
            ErrorTypes.REFRESH_TOKEN_INVALID_OR_EXPIRED,
            "Invalid refresh token"
        );
    }

    const isValid =
        await this.tokenService.compareRefreshToken(
            dto.token,
            user.RefreshToken,
        );

    if (!isValid) {
        throw new ApiException(
            HttpStatus.UNAUTHORIZED,
            ErrorTypes.REFRESH_TOKEN_INVALID_OR_EXPIRED,
            "Invalid refresh token"
        );
    }

    // generate new tokens
    
    return await this.createSession(user, true, dto.clientType)
  }

  async logout(UniqueCode: string): Promise<void> {
    await this.userService.clearRefreshToken(UniqueCode);
  }

  private async createSession(user: UserDocument, persistRefreshToken: boolean, clientType: ClientType) {
    const {hashedRefreshToken, ...restTokens} = await this.tokenService.generateTokens({user, clientType})
    
    if(persistRefreshToken){
        await this.userService.updateRefreshToken(user.UniqueCode, hashedRefreshToken);
    }

    return {
        accessToken: restTokens.accessToken,
        refreshToken: persistRefreshToken ? restTokens.refreshToken : null
    };
  }
}