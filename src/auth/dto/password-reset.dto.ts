import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ClientType } from '@/common/constants/auth.constants';


export class ForgotPasswordDto {

  @IsEmail()
  @IsNotEmpty()
  Email!: string;


  @IsEnum(ClientType)
  @IsNotEmpty()
  ClientType!: ClientType;

}


export class ResetPasswordDto {

  @IsOptional()
  @IsString()
  Token?: string;


  @IsOptional()
  @IsEmail()
  Email?: string;


  @IsOptional()
  @IsString()
  OTP?: string;


  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  NewPassword!: string;

}