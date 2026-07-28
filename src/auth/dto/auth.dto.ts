import { Roles } from '@/common/constants/auth.constants';
import { ApiProperty } from '@nestjs/swagger';
import { ClientType } from '@/common/constants/auth.constants';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional
} from 'class-validator';

export class CurrentUserDto {
  @ApiProperty()
  uniqueCode!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  role!: Roles[];
}

export class LoginDto {

  @ApiProperty({example: 'firozansari3712@gmail.com'})
  @IsEmail()
  Email!: string;

  @ApiProperty({example: 'Welcome*123'})
  @IsString()
  @IsNotEmpty()
  Password!: string;

  @ApiProperty({default: false})
  @IsBoolean()
  RememberMe!: boolean;

  @ApiProperty({example: 'web'})
  @IsString()
  @IsNotEmpty()
  ClientType!: ClientType;
}

export class RegisterDto {

  @ApiProperty({
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  FirstName!: string;

  @ApiProperty({
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  LastName!: string;

  @ApiProperty({
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  Email!: string;

  @ApiProperty({
    example: 'Password@123',
  })
  @IsString()
  @MinLength(8)
  Password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
