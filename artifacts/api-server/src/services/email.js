import { Resend } from 'resend';

const STRIPE_LINKS = {
  foundingMonthly: 'https://buy.stripe.com/6oU4gychFbv43IP2Yo5ZC0c', // $29/mo
  foundingAnnual:  'https://buy.stripe.com/14AeVca9x9mWdjpfLa5ZC0e', // $285/yr
  proMonthly:      'https://buy.stripe.com/fZubJ081p0Qq9390Qg5ZC0b', // $69/mo
};

function pricingOptionsHtml({ highlight = 'founding' } = {}) {
  return `
    <div style="background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 16px 20px; margin: 24px 0;">
      <p style="font-size: 13px; font-weight: 700; color: #1a1a2e; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.05em;">Subscribe directly — no login needed</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <a href="${STRIPE_LINKS.foundingMonthly}" style="color: #c8102e; font-weight: 700; font-size: 15px; text-decoration: none;">
              Founding Member — $29/mo →
            </a>
            <span style="color: #888; font-size: 12px; display: block; margin-top: 2px;">Locked-in for life. Capped at 50 seats.</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <a href="${STRIPE_LINKS.foundingAnnual}" style="color: #c8102e; font-weight: 600; font-size: 14px; text-decoration: none;">
              Founding Member Annual — $285/yr ($23.75/mo) →
            </a>
            <span style="color: #888; font-size: 12px; display: block; margin-top: 2px;">Save ~17% vs monthly.</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0;">
            <a href="${STRIPE_LINKS.proMonthly}" style="color: #555; font-size: 14px; text-decoration: none;">
              Pro — $69/mo →
            </a>
            <span style="color: #888; font-size: 12px; display: block; margin-top: 2px;">150 sessions/mo, all features.</span>
          </td>
        </tr>
      </table>
    </div>
  `;
}

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
    subject: 'Reset your Red Zone Selling AI Coach password',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
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
    subject: 'Your Red Zone Selling AI Coach sign-in link',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
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

export async function sendTrialStartedEmail({ toEmail, displayName, selectedPlan }) {
  const { client, fromEmail } = await getResendClient();
  const appUrl = process.env.APP_URL || 'https://redzoneselling.co';
  const firstName = displayName?.split(' ')[0] || 'there';

  const planName = selectedPlan === 'founding' ? 'Founding Member ($29/mo)'
    : selectedPlan === 'pro' ? 'Pro ($69/mo)'
    : null;

  const planBlurb = planName
    ? `<p style="font-size: 15px; line-height: 1.6;">You signed up for the <strong>${planName}</strong> plan. After your trial, subscribing takes less than 2 minutes — your rate is locked in the moment you subscribe.</p>`
    : '';

  const foundingNote = selectedPlan === 'founding'
    ? `<p style="font-size: 13px; color: #888; line-height: 1.5; margin-top: 0;">Founding Member is capped at 50 seats. Your spot is reserved during your trial.</p>`
    : '';

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'Your 14-day free trial has started — Red Zone Selling AI Coach',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Free Trial</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <h2 style="font-size: 20px; color: #1a1a2e; margin-bottom: 8px;">You're in. Your 14-day free trial is live.</h2>

        <p style="font-size: 15px; line-height: 1.6;">
          You have full access to all three modes — Deal, Coach, and Mindset — for the next 14 days. No credit card required.
        </p>

        ${planBlurb}
        ${foundingNote}

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Go to Your Dashboard
          </a>
        </div>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          Questions? Reply to this email or reach Vince at <a href="mailto:vince@vincebeese.com" style="color: #c8102e;">vince@vincebeese.com</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send trial started email: ${error.message}`);
  return data;
}

export async function sendWelcomeEmail({ toEmail, displayName }) {
  const { client, fromEmail } = await getResendClient();
  const firstName = displayName?.split(' ')[0] || 'there';

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'Welcome to Red Zone Selling AI Coach — your account is being reviewed',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Account Created</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <p style="font-size: 15px; line-height: 1.6;">
          Thanks for signing up! Your account has been created and is now being reviewed.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          You'll receive another email as soon as your access is confirmed. We typically review requests within 1 business day.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          In the meantime, feel free to reach out if you have any questions.
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-top: 24px;">
          — The Red Zone Selling Team
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send welcome email: ${error.message}`);
  return data;
}

export async function sendNewUserAdminNotification({ adminEmail, newUserEmail, newUserName, isTrial = false }) {
  const { client, fromEmail } = await getResendClient();
  const appUrl = process.env.APP_URL || 'https://redzoneselling.co';
  const label = isTrial ? 'New Trial Signup' : 'New Beta Access Request';
  const bodyText = isTrial
    ? 'A new user has signed up for a 14-day free trial:'
    : 'A new user has created an account and is requesting beta access:';

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `${label}: ${newUserName || newUserEmail}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">${label}</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">${bodyText}</p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 12px; background: #f9f9f9; border: 1px solid #eee; font-weight: 600; width: 100px;">Name</td>
            <td style="padding: 8px 12px; border: 1px solid #eee;">${newUserName || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; background: #f9f9f9; border: 1px solid #eee; font-weight: 600;">Email</td>
            <td style="padding: 8px 12px; border: 1px solid #eee;">${newUserEmail}</td>
          </tr>
        </table>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/admin"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Review in Admin Panel
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send admin notification: ${error.message}`);
  return data;
}

export async function sendBetaApprovedEmail({ toEmail, displayName }) {
  const { client, fromEmail } = await getResendClient();
  const appUrl = process.env.APP_URL || 'https://redzoneselling.co';
  const firstName = displayName?.split(' ')[0] || 'there';

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: "You're approved — your Red Zone Selling AI Coach trial is now active",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Trial Access Approved</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <p style="font-size: 15px; line-height: 1.6;">
          Great news — your trial access to <strong>Red Zone Selling AI Coach</strong> has been approved! You're ready to start coaching.
        </p>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          You can subscribe at any time during your trial and your access continues without interruption.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/login"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Sign In &amp; Get Started
          </a>
        </div>

        <div style="background: #f9f9f9; border: 1px solid #eee; border-left: 3px solid #c8102e; border-radius: 6px; padding: 16px 20px; margin: 24px 0;">
          <p style="font-size: 14px; font-weight: 600; color: #1a1a2e; margin: 0 0 6px 0;">Join the Red Zone Selling Community on Slack</p>
          <p style="font-size: 14px; color: #555; line-height: 1.5; margin: 0 0 12px 0;">
            Connect with other members, share wins, ask questions, and get direct access to Vince.
          </p>
          <a href="https://join.slack.com/t/redzoneselling/shared_invite/zt-3v9x4pguq-m8pAfJ3yOge7qNsZHfyp7g"
             style="color: #c8102e; font-size: 14px; font-weight: 600; text-decoration: none;">
            Join the Slack Community →
          </a>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          Welcome to the team. Let's close some deals.
        </p>

        <p style="font-size: 15px; line-height: 1.6; margin-top: 24px;">
          — The Red Zone Selling Team
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send trial approved email: ${error.message}`);
  return data;
}

export async function sendTrialWarningEmail({ toEmail, displayName, type, daysLeft, sessionCount }) {
  const { client, fromEmail } = await getResendClient();
  const appUrl = process.env.APP_URL || 'https://redzoneselling.co';
  const firstName = displayName?.split(' ')[0] || 'there';

  const subjects = {
    '7day':      'Your Red Zone Selling AI Coach trial ends in 7 days',
    '2day':      'Your trial ends in 2 days — Red Zone Selling AI Coach',
    '1day':      'Today is the last day of your trial — Red Zone Selling AI Coach',
    '25session': "You've used 25 of your 75 trial sessions — Red Zone Selling AI Coach",
    '50session': 'Only 25 coaching sessions left in your trial — Red Zone Selling AI Coach',
  };

  const headlines = {
    '7day':      '7 days left in your trial',
    '2day':      'Your trial ends in 2 days',
    '1day':      'Today is the last day of your trial',
    '25session': '25 sessions in — 50 remaining',
    '50session': '50 sessions used — 25 remaining',
  };

  const bodies = {
    '7day': `Your free trial of Red Zone Selling AI Coach ends in <strong>7 days</strong>. To keep your access and all your deals and coaching history, subscribe before your trial expires — you can subscribe at any time, even right now, and your rate locks in immediately.`,
    '2day': `Your free trial expires in <strong>2 days</strong>. Don't lose your deals, sessions, and coaching history — subscribe to keep everything. You can subscribe at any time before your trial ends and your access continues without interruption.`,
    '1day': `Today is the last day of your free trial. After today, your access will be paused — but everything is saved. Your deals, sessions, and coaching history will all be waiting for you.<br /><br />
      Subscribe now to keep your momentum going. You can subscribe at any time, including right now, and your access continues immediately.`,
    '25session': `You've completed <strong>25 coaching sessions</strong> — you've got 50 more before reaching the 75-session trial limit. When you're ready to go unlimited, subscribing takes less than 2 minutes. You can subscribe at any time, even before your trial ends.`,
    '50session': `You've used <strong>50 of your 75 trial sessions</strong>. You've got 25 left. Subscribe now to keep going without interruption — you don't have to wait for your trial to end. Lock in your rate and keep your momentum.`,
  };

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: subjects[type] || 'Your Red Zone Selling AI Coach trial is ending soon',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Trial Update</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <h2 style="font-size: 20px; color: #1a1a2e; margin-bottom: 8px;">${headlines[type] || 'Your trial is ending soon'}</h2>

        <p style="font-size: 15px; line-height: 1.6;">${bodies[type] || 'Your trial is ending soon. Upgrade to keep access.'}</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/paywall"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            View Plans &amp; Subscribe
          </a>
        </div>

        ${pricingOptionsHtml()}

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          Questions? Reply to this email or reach out to <a href="mailto:vince@vincebeese.com" style="color: #c8102e;">vince@vincebeese.com</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send trial warning email: ${error.message}`);
  return data;
}

export async function sendTrialExpiredEmail({ toEmail, displayName, type }) {
  const { client, fromEmail } = await getResendClient();
  const appUrl = process.env.APP_URL || 'https://redzoneselling.co';
  const firstName = displayName?.split(' ')[0] || 'there';

  const configs = {
    expired_day0: {
      subject: 'Your Red Zone Selling AI Coach free trial has ended — here\'s how to keep going',
      headline: 'Your free trial has ended',
      body: `Your 14-day free trial ended today. Your access is paused, but everything is still there — your deals, coaching sessions, and history are all saved and waiting.<br /><br />
        <strong>Your data is stored for 30 days.</strong> Subscribe any time within that window and pick up exactly where you left off. After 30 days, your data will be permanently deleted.`,
      cta: 'View Plans &amp; Subscribe',
    },
    expired_day3: {
      subject: 'Still thinking? Here\'s what\'s waiting for you',
      headline: 'Your account is still here',
      body: `Your Red Zone Selling AI Coach account is still here, and so is everything in it. You have <strong>27 days</strong> before your data is permanently deleted.<br /><br />
        A lot of sellers try a few tools during a trial and never go deep enough to feel the difference. If that was you — no problem. But if you got value from the coaching, this is worth finishing.<br /><br />
        Founding Member rate is <strong>$29/month</strong> and locks in for life — capped at 50 seats. Once they're gone, this plan closes permanently.`,
      cta: 'Claim Your Spot',
    },
    expired_day7: {
      subject: 'Still time to keep your Red Zone Selling AI Coach account',
      headline: 'Still time to get back in',
      body: `Your trial expired a week ago. Your data is still saved — you have <strong>23 days</strong> remaining before it's permanently deleted.<br /><br />
        If you got value from the coaching, this is an easy decision. If you're not sure, reply and tell us what held you back — Vince reads these.`,
      cta: 'Subscribe and Keep Your Data',
    },
    expired_day14: {
      subject: 'Your Red Zone Selling AI Coach data will be deleted in 16 days',
      headline: '16 days left before your data is deleted',
      body: `Your trial ended 2 weeks ago. Your deals, coaching sessions, and history are still saved — but your account will be permanently deleted in <strong>16 days</strong> if you don't subscribe.<br /><br />
        Subscribing takes less than 2 minutes and your data will be there waiting for you. If you've decided this isn't for you, no hard feelings.`,
      cta: 'Subscribe and Keep My Data',
    },
    expired_day28: {
      subject: 'Final notice — your Red Zone Selling AI Coach data will be deleted in 2 days',
      headline: 'Final notice — 2 days until your data is deleted',
      body: `This is the last email we'll send.<br /><br />
        Your Red Zone Selling AI Coach account has been inactive for 28 days. In <strong>2 days</strong>, your deals, coaching sessions, and history will be permanently deleted and cannot be recovered.<br /><br />
        If you want to keep everything and get back to work, subscribe now — it takes less than 2 minutes.<br /><br />
        If you've decided this isn't for you, no hard feelings. We hope the trial gave you something useful.`,
      cta: 'Subscribe Now — Save My Data',
    },
  };

  const config = configs[type];
  if (!config) throw new Error(`Unknown expired email type: ${type}`);

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: config.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Trial Update</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <h2 style="font-size: 20px; color: #1a1a2e; margin-bottom: 8px;">${config.headline}</h2>

        <p style="font-size: 15px; line-height: 1.6;">${config.body}</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${STRIPE_LINKS.foundingMonthly}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            ${config.cta}
          </a>
        </div>

        ${pricingOptionsHtml()}

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          Questions? Reply to this email or reach out to <a href="mailto:vince@vincebeese.com" style="color: #c8102e;">vince@vincebeese.com</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send trial expired email: ${error.message}`);
  return data;
}

export async function sendSubscriptionConfirmationEmail({ toEmail, displayName }) {
  const { client, fromEmail } = await getResendClient();
  const appUrl = process.env.APP_URL || 'https://redzoneselling.co';
  const firstName = displayName?.split(' ')[0] || 'there';

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: "You're in — welcome to Red Zone Selling AI Coach",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Subscription Confirmed</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <h2 style="font-size: 20px; color: #1a1a2e; margin-bottom: 8px;">Your subscription is confirmed.</h2>

        <p style="font-size: 15px; line-height: 1.6;">
          You're back in with full access. Everything is exactly where you left it — your deals, your sessions, your history. Pick up right where you stopped.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Open Red Zone Selling AI Coach
          </a>
        </div>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          Questions at any time — reply here or reach Vince at <a href="mailto:vince@vincebeese.com" style="color: #c8102e;">vince@vincebeese.com</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send subscription confirmation email: ${error.message}`);
  return data;
}

export async function sendBackupEmail({ toEmail, dateStr, tableResults, attachments }) {
  const { client, fromEmail } = await getResendClient();

  const successRows = tableResults.filter(t => t.success);
  const failedRows = tableResults.filter(t => !t.success);

  const tableHtml = tableResults.map(t => `
    <tr>
      <td style="padding: 7px 12px; border: 1px solid #eee;">${t.table}</td>
      <td style="padding: 7px 12px; border: 1px solid #eee; text-align: right;">${t.success ? t.rows.toLocaleString() : '—'}</td>
      <td style="padding: 7px 12px; border: 1px solid #eee; color: ${t.success ? '#2d7a2d' : '#c8102e'}; font-weight: 600;">${t.success ? 'OK' : 'Failed'}</td>
    </tr>
  `).join('');

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `Weekly Database Backup — ${dateStr}`,
    attachments,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Weekly Database Backup</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">
          Your weekly backup completed on <strong>${dateStr}</strong>.<br />
          ${successRows.length} of ${tableResults.length} tables exported successfully.
          ${failedRows.length > 0 ? `<span style="color:#c8102e"> ${failedRows.length} table(s) failed.</span>` : ''}
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Table</th>
              <th style="padding: 8px 12px; border: 1px solid #eee; text-align: right;">Rows</th>
              <th style="padding: 8px 12px; border: 1px solid #eee; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>${tableHtml}</tbody>
        </table>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          Each table is attached as a CSV file. Save them to Google Drive to complete your backup.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send backup email: ${error.message}`);
  return data;
}

export async function sendNewSubscriberWelcomeEmail({ toEmail, displayName, setPasswordUrl }) {
  const { client, fromEmail } = await getResendClient();
  const firstName = displayName?.split(' ')[0] || 'there';

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'Your Red Zone Selling AI Coach account is ready — set your password',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Subscription Confirmed</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">Hi ${firstName},</p>

        <h2 style="font-size: 20px; color: #1a1a2e; margin-bottom: 8px;">Your subscription is confirmed and your account is ready.</h2>

        <p style="font-size: 15px; line-height: 1.6;">
          We've created your Red Zone Selling AI Coach account using the email address from your subscription. One last step — click below to set your password and start coaching.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${setPasswordUrl}"
             style="background-color: #c8102e; color: #ffffff; text-decoration: none;
                    padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600; display: inline-block;">
            Set My Password →
          </a>
        </div>

        <p style="font-size: 13px; color: #888; line-height: 1.5;">
          This link expires in <strong>7 days</strong> and can only be used once.<br />
          Questions? Reply to this email or reach Vince at <a href="mailto:vince@vincebeese.com" style="color: #c8102e;">vince@vincebeese.com</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">REDZONESELLING.CO</p>
      </div>
    `,
  });

  if (error) throw new Error(`Failed to send new subscriber welcome email: ${error.message}`);
  return data;
}

export async function sendInviteEmail({ toEmail, inviteUrl, inviterName }) {
  const { client, fromEmail } = await getResendClient();

  const { data, error } = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: "You're invited to Red Zone Selling AI Coach",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #1a1a2e;">
        <h1 style="color: #c8102e; font-size: 22px; margin-bottom: 4px;">Red Zone Selling AI Coach</h1>
        <p style="color: #666; font-size: 13px; margin-top: 0;">Invitation</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="font-size: 15px; line-height: 1.6;">
          ${inviterName ? `<strong>${inviterName}</strong> has invited you` : 'You have been invited'} to join Red Zone Selling AI Coach — an AI-powered sales coaching platform built for elite performers.
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Click the button below to create your account and start your 14-day free trial.
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
