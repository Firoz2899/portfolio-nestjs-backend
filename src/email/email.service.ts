import {createElement} from 'react'
import { AppConfigService } from '@/config/app-config.service';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { type Transporter, createTransport } from 'nodemailer';
import type { SendTemplatedEmailOptions, SendMailOptions } from './interface/send-email-options.interface';
import VerifyEmailTemplate from '@email/templates/verify-email'
import { render } from 'react-email';
import { EmailTemplateContext } from './interface/email-template-context.interface';
import { SendVerificationEmailDto } from './dto/auth.dto';
import PasswordResetTemplate from './templates/password-reset';

@Injectable()
export class EmailService implements OnModuleInit {     // OnModuleInit Called after Nest has instantiated this provider.
    private readonly transporter: Transporter;
    private readonly logger = new Logger(EmailService.name);
    
    constructor(
        private readonly appConfig: AppConfigService
    ){
        this.transporter = createTransport({
            host: this.appConfig.smtpHost,
            port: this.appConfig.smtpPort,
            secure: this.appConfig.smtpSecure,
            auth: {
                user: this.appConfig.smtpUser,
                pass: this.appConfig.smtpPassword
            }
        });

    }   

    async onModuleInit() {
        try {
            await this.transporter.verify();
            this.logger.log('SMTP connection established.');
        }
        catch(error){
            this.logger.error(
                'Failed to establish SMTP connection.',
                error instanceof Error ? error.stack : undefined,
            );
            throw error;
        }
    }

    async sendVerificationEmail(dto: SendVerificationEmailDto): Promise<void> {
        this.renderAndSendEmail({
            to: dto.email,
            subject: "Verify your email address",
            template: createElement(VerifyEmailTemplate, {
                firstName: dto.firstName,
                otp: dto.otp,
                expiryMinutes: this.appConfig.emailVerificationOtpExpiryMinutes,
                ...this.getTemplateContext()
            })
        });
    }

    async sendPasswordResetEmail(
        email: string,
        firstName: string,
        resetLink: string,
        otp: string,
    ) {
        return this.renderAndSendEmail({
            to: email,
            subject: "Reset your password",
            template: createElement(PasswordResetTemplate, {
                firstName,
                resetLink,
                otp,
                expiryMinutes: this.appConfig.passwordResetOtpExpiry,
                ...this.getTemplateContext()
            }),
        });
    }

    private async sendMail(options: SendMailOptions): Promise<void>{
        this.transporter.sendMail({
            from: this.appConfig.smtpFrom,
            ...options
        })
    }

    private async renderAndSendEmail(options: SendTemplatedEmailOptions): Promise<void> {
        const html = await render(options.template);

        this.sendMail({
            to: options.to,
            subject: options.subject,
            html,
        });
    }

    private getTemplateContext(): EmailTemplateContext {
        return {
            companyName: this.appConfig.appName,
            appUrl: this.appConfig.appUrl,
            supportEmail: this.appConfig.supportEmail,
        };
    }
}
