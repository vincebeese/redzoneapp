import { Resend } from 'resend';

function getCredentials() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return {
    apiKey,
    fromEmail: 'noreply@redzoneselling.co',
  };
}

function getResendClient() {
  const { apiKey, fromEmail } = getCredentials();
  return { client: new Resend(apiKey), fromEmail };
}

export async function sendPasswordResetEmail({ toEmail, resetUrl }) {
  const { client, fromEmail } = await getResendClient();

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'Reset your Red Zone Selling Coach password',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling Coach™</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Password Reset</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to set a new one.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Reset my password
          </a>
        </div>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          This link expires in <strong>1 hour</strong> and can only be used once.<br />
          If you didn't request a password reset, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send reset email: ${error.message}`);
  }

  return data;
}

export async function sendMagicLinkEmail({ toEmail, magicUrl }) {
  const { client, fromEmail } = await getResendClient();

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'Your Red Zone Selling Coach sign-in link',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling Coach™</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Passwordless Sign-In</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">
          Click the button below to sign in instantly — no password needed.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${magicUrl}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Sign me in
          </a>
        </div>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          This link expires in <strong>15 minutes</strong> and can only be used once.<br />
          If you didn't request this, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send magic link email: ${error.message}`);
  }

  return data;
}

export async function sendInviteEmail({ toEmail, inviteUrl, inviterName }) {
  const { client, fromEmail } = await getResendClient();

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: "You're invited to Red Zone Selling Coach",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling Coach™</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Beta Access Invitation</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">
          ${inviterName ? `<strong>${inviterName}</strong> has` : 'You have been'} invited you to join the Red Zone Selling Coach beta program — an AI-powered sales coaching platform built for elite performers.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Click the button below to create your account. Your beta access will be activated automatically.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteUrl}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Accept Invitation
          </a>
        </div>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          This link is personal to you and can only be used once. It expires in 7 days.<br />
          If you weren't expecting this email, you can safely ignore it.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send invite email: ${error.message}`);
  }

  return data;
}
