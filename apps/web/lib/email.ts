import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'OriginAI <no-reply@originai.com>';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log('No Resend API key, skipping email:', options.subject);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Error sending email:', error);
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function sendDepositConfirmed(
  backerEmail: string,
  backerName: string,
  projectTitle: string,
  amount: number
) {
  return sendEmail({
    to: backerEmail,
    subject: `Deposit confirmed for ${projectTitle}`,
    html: `
      <h1>Your deposit is confirmed!</h1>
      <p>Hi ${backerName},</p>
      <p>Thank you for reserving <strong>${projectTitle}</strong>.</p>
      <p><strong>Deposit amount:</strong> $${(amount / 100).toFixed(2)}</p>
      <p>Your deposit is held in escrow. If the project doesn't reach its goal by the deadline, you'll be automatically refunded.</p>
      <p>We'll keep you updated on the project's progress.</p>
      <p>—<br>The OriginAI Team</p>
    `,
  });
}

export async function sendProjectLocked(
  backerEmail: string,
  backerName: string,
  projectTitle: string
) {
  return sendEmail({
    to: backerEmail,
    subject: `${projectTitle} reached its goal!`,
    html: `
      <h1>Production is starting!</h1>
      <p>Hi ${backerName},</p>
      <p>Great news! <strong>${projectTitle}</strong> has reached its funding goal.</p>
      <p>The design is now locked and we're moving to production. We'll send you updates as we hit key milestones.</p>
      <p>—<br>The OriginAI Team</p>
    `,
  });
}

export async function sendProjectRefunded(
  backerEmail: string,
  backerName: string,
  projectTitle: string,
  amount: number
) {
  return sendEmail({
    to: backerEmail,
    subject: `Refund processed for ${projectTitle}`,
    html: `
      <h1>Your deposit has been refunded</h1>
      <p>Hi ${backerName},</p>
      <p>Unfortunately, <strong>${projectTitle}</strong> did not reach its funding goal by the deadline.</p>
      <p>Your deposit of $${(amount / 100).toFixed(2)} has been automatically refunded to your original payment method.</p>
      <p>Thank you for supporting new product ideas. We hope you'll find another project to back!</p>
      <p>—<br>The OriginAI Team</p>
    `,
  });
}

export async function sendUpdatePosted(
  backerEmail: string,
  backerName: string,
  projectTitle: string,
  updateTitle: string,
  updateBody: string
) {
  return sendEmail({
    to: backerEmail,
    subject: `Update: ${projectTitle}`,
    html: `
      <h1>${updateTitle}</h1>
      <p>Hi ${backerName},</p>
      <p>There's a new update for <strong>${projectTitle}</strong>:</p>
      <div style="padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
        ${updateBody}
      </div>
      <p>—<br>The OriginAI Team</p>
    `,
  });
}

export async function sendDeadlineReminder(
  backerEmail: string,
  backerName: string,
  projectTitle: string,
  daysLeft: number
) {
  return sendEmail({
    to: backerEmail,
    subject: `${daysLeft} days left for ${projectTitle}`,
    html: `
      <h1>Time is running out!</h1>
      <p>Hi ${backerName},</p>
      <p><strong>${projectTitle}</strong> has only ${daysLeft} days left to reach its goal.</p>
      <p>Share it with friends who might be interested!</p>
      <p>—<br>The OriginAI Team</p>
    `,
  });
}
