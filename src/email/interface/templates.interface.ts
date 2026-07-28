import {ReactNode} from 'react'
import { EmailTemplateContext } from "./email-template-context.interface";

export interface AuthEmailLayoutProps extends EmailTemplateContext {
    preview: string;
    children: ReactNode;
}

export interface PasswordResetTemplateProps extends EmailTemplateContext {
    firstName: string;
    resetLink: string;
    otp: string;
    expiryMinutes: number;
}

export interface VerifyEmailTemplateProps extends EmailTemplateContext {
    firstName: string;
    otp: string;
    expiryMinutes: number;
}