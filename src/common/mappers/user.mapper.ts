import { Injectable } from '@nestjs/common';

import { UserDocument } from '@user/interfaces/user.interface';

import { CurrentUserDto } from '@auth/dto/current-user.dto';

@Injectable()
export class UserMapper {
  toCurrentUserDto(user: UserDocument): CurrentUserDto {
    return {
      uniqueCode: user.UniqueCode,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
      role: user.Role,
    };
  }
}