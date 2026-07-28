import { UserDocument } from '@/user/interfaces/user.interface';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}