import { Log } from '@shared/lib/logger.lib';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

export type EmailSendParams = {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    emailType: EmailType;
}

export const enum EmailType {
    BASE = "base",
    EMAIL_VERIFICATION = "email_verification",
    PASSWORD_RESET = "password_reset",
}


const emailConfigOptions: SMTPTransport.Options = {
    name: process.env.SMTP_HOST as string,
    host: process.env.SMTP_HOST as string,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
    },
    port: process.env.SMTP_PORT as unknown as number,
    secure: false, //TLS requires secure to be false.
    auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
    },
}

const transport = nodemailer.createTransport(emailConfigOptions as SMTPTransport.Options);

export default class Email {
    public static async sendEmail(data: EmailSendParams, emailType: EmailType = EmailType.BASE) {
        Log.info(`Attempting to send email of type ${emailType.toString()} to ${data.to}`);
        try {
            const mail = await transport.sendMail(data);
            Log.info("Email sent to " + data.to);
            return mail;
        } catch (error) {
            Log.error(`Error sending email to ${data.to}`, error as Error);
            throw new Error("Error sending email.", error as Error);
        }
    }
}

