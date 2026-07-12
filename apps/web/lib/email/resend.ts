import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend | null {
  if (process.env.DISABLE_EMAIL === "true") return null;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_placeholder") return null;
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/** Sends email only when Resend is configured and emails are not disabled. */
export async function sendEmail(
  options: SendEmailOptions,
): Promise<{ sent: boolean; id?: string }> {
  const client = getResendClient();
  if (!client) {
    return { sent: false };
  }

  const from =
    process.env.RESEND_FROM_EMAIL ?? "SurfScore <onboarding@resend.dev>";

  const result = await client.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  return { sent: true, id: result.data?.id };
}
