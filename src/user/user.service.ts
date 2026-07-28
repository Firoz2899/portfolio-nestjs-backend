import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { User } from '@user/schemas/user.schema';
import { UserDocument } from '@user/interfaces/user.interface';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ Email: email.toLowerCase() });
  }

  async findByUniqueCode(uniqueCode: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ UniqueCode: uniqueCode });
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async updateRefreshToken(
    uniqueCode: string,
    refreshToken: string,
  ) {
    return this.userModel.findOneAndUpdate(
      { UniqueCode: uniqueCode },
      { RefreshToken: refreshToken },
      { new: true },
    );
  }

  async clearRefreshToken(uniqueCode: string) {
    return this.userModel.findOneAndUpdate(
      { UniqueCode: uniqueCode },
      {
        $unset: {
          RefreshToken: 1,
        },
      },
    );
  }

  async updatePasswordResetOTP(
    uniqueCode: string,
    hashedOTP: string,
    expiresAt: Date,
  ) {
    return this.userModel.findOneAndUpdate(
      { UniqueCode: uniqueCode },
      {
        PasswordResetOTP: hashedOTP,
        PasswordResetOTPExpiresAt: expiresAt,
        PasswordResetRequestedAt: new Date(),
      },
      { new: true },
    );
  }

  async clearPasswordResetOTP(uniqueCode: string) {
    return this.userModel.findOneAndUpdate(
      { UniqueCode: uniqueCode },
      {
        $unset: {
          PasswordResetOTP: 1,
          PasswordResetOTPExpiresAt: 1,
          PasswordResetRequestedAt: 1,
        },
      },
      { new: true },
    );
  }
}