import { type SendMailOptions as NodeMailerSendMailOptions } from "nodemailer";
import {type ReactNode} from 'react'

export interface SendMailOptions
    extends Omit<NodeMailerSendMailOptions, "from"> {}

export interface SendTemplatedEmailOptions {
    to: string;
    subject: string;
    template: ReactNode;
}