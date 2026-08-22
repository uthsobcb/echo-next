import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
}

/**
 * Shared utility to send emails via Resend.
 * Centralizing this ensures consistent sender addresses and error handling.
 */
export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not defined in environment variables");
        return { error: "Mailing service misconfigured" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: from || process.env.MAIL_FROM || "Echo <system@echojournal.life>",
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Resend API Error:", error);
            return { error: error.message };
        }

        return { data };
    } catch (error: any) {
        console.error("Unexpected error in sendEmail:", error);
        return { error: error.message || "Failed to send email" };
    }
}
