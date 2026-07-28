import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {Roles} from '@common/constants/auth.constants'
import { UniqueCodePrefixes } from '@common/constants/common.constants';
import { generateUniqueCode } from '@common/utils/generate-unique-data';
import * as bcrypt from 'bcryptjs';

@Schema({
  timestamps: true,
})
export class User {
    @Prop({
        required: true,
        trim: true,
    })
    FirstName!: string;

    @Prop({
        required: true,
        trim: true,
    })
    LastName!: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    Email!: string;

    @Prop({
        required: true,
    })
    Password!: string;

    @Prop()
    RefreshToken?: string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
        default: () => generateUniqueCode(UniqueCodePrefixes.User),
    })
    UniqueCode!: string;

    @Prop({
        type: [String],
        enum: Roles,
        default: [Roles.USER],
    })
    Role!: Roles[];

    @Prop({
        default: true,
    })
    IsActive!: boolean;

    @Prop({
        default: false,
    })
    IsEmailVerified!: boolean;

    @Prop()
    EmailVerificationOTP?: string;

    @Prop()
    EmailVerificationOTPExpiresAt?: Date;

    @Prop()
    PasswordResetOTP?: string;

    @Prop()
    PasswordResetOTPExpiresAt?: Date;    

    @Prop()
    PasswordResetRequestedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

const SALT_ROUNDS = 10;

UserSchema.pre('save', async function () {

  if (this.isModified('Password')) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.Password = await bcrypt.hash(this.Password, salt);
  }
});

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.Password);
};

UserSchema.index({
    UniqueCode: 1
});