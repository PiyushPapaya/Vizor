// Email notification system using EmailJS or similar service

export interface EmailConfig {
  to: string;
  subject: string;
  message: string;
  html?: string;
}

export interface EmailTemplate {
  type: 'welcome' | 'export_ready' | 'upgrade' | 'weekly_report' | 'password_reset';
  data: Record<string, any>;
}

// Email templates
const templates = {
  welcome: (data: { name: string }) => ({
    subject: 'Welcome to ChartForge! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2DBDAA;">Welcome to ChartForge!</h1>
        <p>Hi ${data.name},</p>
        <p>Thanks for signing up! We're excited to have you on board.</p>
        <p>Here's what you can do with ChartForge:</p>
        <ul>
          <li>Create 15+ types of charts and graphs</li>
          <li>Import data from CSV, JSON, and Excel</li>
          <li>Export to PNG, SVG, and PDF</li>
          <li>Collaborate with your team</li>
        </ul>
        <a href="https://chartforge.com/app" style="display: inline-block; padding: 12px 24px; background: #2DBDAA; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Get Started</a>
        <p>Need help? Check out our <a href="https://chartforge.com/docs">documentation</a> or reply to this email.</p>
        <p>Happy charting!<br>The ChartForge Team</p>
      </div>
    `,
  }),
  
  export_ready: (data: { chartName: string; downloadUrl: string }) => ({
    subject: `Your chart "${data.chartName}" is ready! 📊`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2DBDAA;">Your Export is Ready!</h1>
        <p>Your chart "<strong>${data.chartName}</strong>" has been successfully exported.</p>
        <a href="${data.downloadUrl}" style="display: inline-block; padding: 12px 24px; background: #2DBDAA; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Download Chart</a>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The ChartForge Team</p>
      </div>
    `,
  }),

  upgrade: (data: { name: string; plan: string }) => ({
    subject: 'Upgrade to ChartForge Pro 🚀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2DBDAA;">Unlock More with ChartForge Pro</h1>
        <p>Hi ${data.name},</p>
        <p>You've been creating amazing charts! Ready to take it to the next level?</p>
        <h3>Pro Features:</h3>
        <ul>
          <li>✓ Unlimited projects</li>
          <li>✓ Remove watermarks</li>
          <li>✓ Advanced export options</li>
          <li>✓ Priority support</li>
          <li>✓ Team collaboration</li>
        </ul>
        <a href="https://chartforge.com/pricing" style="display: inline-block; padding: 12px 24px; background: #2DBDAA; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Upgrade Now</a>
        <p>Starting at just $9/month.</p>
      </div>
    `,
  }),

  weekly_report: (data: { name: string; chartsCreated: number; exportsCount: number; topChart: string }) => ({
    subject: 'Your Weekly ChartForge Summary 📈',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2DBDAA;">Your Weekly Summary</h1>
        <p>Hi ${data.name},</p>
        <p>Here's what you accomplished this week:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Charts Created:</strong> ${data.chartsCreated}</p>
          <p><strong>Exports:</strong> ${data.exportsCount}</p>
          <p><strong>Most Used Chart:</strong> ${data.topChart}</p>
        </div>
        <p>Keep up the great work!</p>
        <a href="https://chartforge.com/app" style="display: inline-block; padding: 12px 24px; background: #2DBDAA; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Create More Charts</a>
      </div>
    `,
  }),

  password_reset: (data: { name: string; resetUrl: string }) => ({
    subject: 'Reset Your ChartForge Password 🔒',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2DBDAA;">Password Reset Request</h1>
        <p>Hi ${data.name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="${data.resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2DBDAA; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Security tip: Never share your password with anyone.</p>
      </div>
    `,
  }),
};

// Send email using EmailJS (free service)
export const sendEmail = async (config: EmailConfig): Promise<boolean> => {
  try {
    // In production, use EmailJS or similar service
    // For now, we'll just log it
    console.log('📧 Email would be sent:', config);
    
    // Example with EmailJS:
    // const response = await emailjs.send(
    //   'YOUR_SERVICE_ID',
    //   'YOUR_TEMPLATE_ID',
    //   {
    //     to_email: config.to,
    //     subject: config.subject,
    //     message: config.message,
    //     html_content: config.html,
    //   },
    //   'YOUR_PUBLIC_KEY'
    // );
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Send templated email
export const sendTemplatedEmail = async (
  to: string,
  template: EmailTemplate
): Promise<boolean> => {
  const emailTemplate = templates[template.type];
  if (!emailTemplate) {
    console.error('Unknown email template:', template.type);
    return false;
  }

  const { subject, html } = emailTemplate(template.data as any);

  return sendEmail({
    to,
    subject,
    message: '', // Plain text version can be generated from HTML
    html,
  });
};

// Queue emails for batch sending (useful for newsletters)
class EmailQueue {
  private queue: EmailConfig[] = [];

  add(email: EmailConfig) {
    this.queue.push(email);
  }

  async flush(): Promise<number> {
    let sent = 0;
    for (const email of this.queue) {
      const success = await sendEmail(email);
      if (success) sent++;
      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.queue = [];
    return sent;
  }

  size() {
    return this.queue.length;
  }
}

export const emailQueue = new EmailQueue();

// Helper functions for common email scenarios
export const sendWelcomeEmail = (to: string, name: string) => {
  return sendTemplatedEmail(to, {
    type: 'welcome',
    data: { name },
  });
};

export const sendExportReadyEmail = (to: string, chartName: string, downloadUrl: string) => {
  return sendTemplatedEmail(to, {
    type: 'export_ready',
    data: { chartName, downloadUrl },
  });
};

export const sendUpgradeEmail = (to: string, name: string, plan: string) => {
  return sendTemplatedEmail(to, {
    type: 'upgrade',
    data: { name, plan },
  });
};

export const sendWeeklyReport = (to: string, name: string, stats: { chartsCreated: number; exportsCount: number; topChart: string }) => {
  return sendTemplatedEmail(to, {
    type: 'weekly_report',
    data: { name, ...stats },
  });
};

export const sendPasswordReset = (to: string, name: string, resetUrl: string) => {
  return sendTemplatedEmail(to, {
    type: 'password_reset',
    data: { name, resetUrl },
  });
};
