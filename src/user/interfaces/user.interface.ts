import {User} from '@user/schemas/user.schema'
import { HydratedDocument } from 'mongoose';

export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<User, UserMethods>;