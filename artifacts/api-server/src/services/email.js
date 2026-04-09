import { Resend } from 'resend';

let connectionSettings;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        Accept: 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }

  return {
    apiKey: connectionSettings.settings.api_key,
    fromEmail: connectionSettings.settings.from_email || 'noreply@redzoneselling.co',
  };
}

async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return { client: new Resend(apiKey), fromEmail };
}

export async function sendPasswordResetEmail({ toEmail, resetUrl }) {
  const { client, fromEmail } = await getUncachableResendClient();

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
  const { client, fromEmail } = await getUncachableResendClient();

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
  const { client, fromEmail } = await getUncachableResendClient();

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
