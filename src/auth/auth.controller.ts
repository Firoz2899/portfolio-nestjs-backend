import { type Response, type Request } from 'express';
import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from '@/auth/services/auth.service';

import { RegisterDto, LoginDto, CurrentUserDto, RefreshTokenDto } from '@auth/dto/auth.dto';

import { Public } from '@auth/decorators/public.decorator';
import { SuccessMessage } from '@common/decorators/success-message.decorator';
import { CurrentUser } from '@auth/decorators/current-user.decorator';

import { CookieService } from '@/common/cookie/cookie.service';

import { ClientType, HttpCookies } from '@/common/constants/auth.constants';

import { type UserDocument } from '@/user/interfaces/user.interface';

import { UserMapper } from '@/common/mappers/user.mapper';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly userMapper: UserMapper,
  ) {}

  @Public()
  @Post('register')
  @SuccessMessage('Registration successful')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account and sends an email verification OTP.',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @SuccessMessage('Login successful')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate user and get access tokens.'
  })
  async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) response: Response,
  ) {
      const result = await this.authService.login(loginDto);

      this.cookieService.setAccessToken(
        response,
        result.tokens.accessToken,
        true,
      );

      if (result.tokens.refreshToken) {
          this.cookieService.setRefreshToken(
            response,
            result.tokens.refreshToken,
            true,
          );
      }

      return result;
  }

  @Public()
  @Post('refresh')
  @SuccessMessage('Access token refreshed')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates a new access token using a valid refresh token.',
  })
  async refresh(
      @Body() dto: RefreshTokenDto,
      @Req() request: Request,
      @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.[HttpCookies.RefreshToken] ?? dto.refreshToken;
    const clientType = request.headers["x-app-client"]?.toString() || ""

    const result = await this.authService.refresh({token: refreshToken, clientType: clientType as ClientType});

    this.cookieService.setAccessToken(
      response,
      result.accessToken,
      true,
    );

    if(result.refreshToken){
      this.cookieService.setRefreshToken(
        response,
        result.refreshToken,
        true,
      );
    }


    return result;
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @SuccessMessage('User profile retrieved successfully')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user.',
  })
  me(@CurrentUser() user: UserDocument): CurrentUserDto  {
    return this.userMapper.toCurrentUserDto(user);
  }
  
  @Post('logout')
  @ApiBearerAuth('access-token')
  @SuccessMessage('Logout successful')
  @ApiOperation({
    summary: 'Logout',
    description: 'Logs out the authenticated user and invalidates the refresh token.',
  })
  async logout(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.UniqueCode);

    this.cookieService.clearTokens(response);

    return null;
  }
  
}