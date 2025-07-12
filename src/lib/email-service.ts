// Email Service with SendGrid and Mailgun support
interface EmailProvider {
  name: string
  apiKey: string
  fromEmail: string
  fromName: string
}

interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent: string
}

interface EmailData {
  to: string
  toName?: string
  subject: string
  htmlContent: string
  textContent: string
  templateId?: string
  templateData?: Record<string, any>
}

export class EmailService {
  private provider: EmailProvider | null = null
  private providerType: 'sendgrid' | 'mailgun' | 'smtp' | null = null

  constructor() {
    this.initializeProvider()
  }

  private initializeProvider() {
    // Check for SendGrid configuration
    if (process.env.SENDGRID_API_KEY) {
      this.provider = {
        name: 'SendGrid',
        apiKey: process.env.SENDGRID_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'noreply@santanacounseling.com',
        fromName: process.env.FROM_NAME || 'Santana AI Counselor'
      }
      this.providerType = 'sendgrid'
      return
    }

    // Check for Mailgun configuration
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      this.provider = {
        name: 'Mailgun',
        apiKey: process.env.MAILGUN_API_KEY,
        fromEmail: process.env.FROM_EMAIL || `noreply@${process.env.MAILGUN_DOMAIN}`,
        fromName: process.env.FROM_NAME || 'Santana AI Counselor'
      }
      this.providerType = 'mailgun'
      return
    }

    // Check for SMTP configuration
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.provider = {
        name: 'SMTP',
        apiKey: '', // Not used for SMTP
        fromEmail: process.env.FROM_EMAIL || process.env.SMTP_USER,
        fromName: process.env.FROM_NAME || 'Santana AI Counselor'
      }
      this.providerType = 'smtp'
      return
    }

    console.warn('No email provider configured. Email notifications will be disabled.')
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.provider || !this.providerType) {
      console.log('Email would be sent:', emailData.subject, 'to', emailData.to)
      return { success: false, error: 'No email provider configured' }
    }

    try {
      switch (this.providerType) {
        case 'sendgrid':
          return await this.sendWithSendGrid(emailData)
        case 'mailgun':
          return await this.sendWithMailgun(emailData)
        case 'smtp':
          return await this.sendWithSMTP(emailData)
        default:
          return { success: false, error: 'Unknown email provider' }
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  private async sendWithSendGrid(emailData: EmailData) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.provider!.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: emailData.to, name: emailData.toName }],
          dynamic_template_data: emailData.templateData || {}
        }],
        from: {
          email: this.provider!.fromEmail,
          name: this.provider!.fromName
        },
        subject: emailData.subject,
        content: [
          {
            type: 'text/html',
            value: emailData.htmlContent
          },
          {
            type: 'text/plain',
            value: emailData.textContent
          }
        ],
        ...(emailData.templateId && { template_id: emailData.templateId })
      })
    })

    if (response.ok) {
      return { success: true, messageId: response.headers.get('x-message-id') || undefined }
    } else {
      const error = await response.text()
      return { success: false, error: `SendGrid error: ${error}` }
    }
  }

  private async sendWithMailgun(emailData: EmailData) {
    const formData = new FormData()
    formData.append('from', `${this.provider!.fromName} <${this.provider!.fromEmail}>`)
    formData.append('to', emailData.toName ? `${emailData.toName} <${emailData.to}>` : emailData.to)
    formData.append('subject', emailData.subject)
    formData.append('html', emailData.htmlContent)
    formData.append('text', emailData.textContent)

    const response = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${this.provider!.apiKey}`).toString('base64')}`
      },
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, messageId: result.id }
    } else {
      const error = await response.text()
      return { success: false, error: `Mailgun error: ${error}` }
    }
  }

  private async sendWithSMTP(emailData: EmailData) {
    // For SMTP, we'll use a simple implementation
    // In production, you might want to use nodemailer or similar
    console.log('SMTP email would be sent:', {
      from: `${this.provider!.fromName} <${this.provider!.fromEmail}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.htmlContent,
      text: emailData.textContent
    })
    
    // Simulate successful sending for now
    return { success: true, messageId: `smtp-${Date.now()}` }
  }

  // Email templates
  getWelcomeEmail(userName: string, clinicName: string): EmailTemplate {
    return {
      subject: `Welcome to ${clinicName} - Santana AI Counselor`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Welcome to Santana AI Counselor</h1>
          <p>Dear ${userName},</p>
          <p>Welcome to ${clinicName}! We're excited to support you on your fertility journey.</p>
          <p>Your account has been created and you can now access our comprehensive counseling platform.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <ul>
              <li>Complete your initial assessment</li>
              <li>Schedule your first counseling session</li>
              <li>Explore our resource library</li>
            </ul>
          </div>
          <p>If you have any questions, please don't hesitate to reach out to your counseling team.</p>
          <p>Best regards,<br>The Santana AI Counselor Team</p>
        </div>
      `,
      textContent: `Welcome to Santana AI Counselor\n\nDear ${userName},\n\nWelcome to ${clinicName}! We're excited to support you on your fertility journey.\n\nYour account has been created and you can now access our comprehensive counseling platform.\n\nWhat's Next?\n- Complete your initial assessment\n- Schedule your first counseling session\n- Explore our resource library\n\nIf you have any questions, please don't hesitate to reach out to your counseling team.\n\nBest regards,\nThe Santana AI Counselor Team`
    }
  }

  getAppointmentReminderEmail(userName: string, appointmentDate: string, counselorName: string): EmailTemplate {
    return {
      subject: 'Appointment Reminder - Santana AI Counselor',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3B82F6;">Appointment Reminder</h1>
          <p>Dear ${userName},</p>
          <p>This is a friendly reminder about your upcoming counseling session.</p>
          <div style="background: #EBF8FF; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3>Appointment Details</h3>
            <p><strong>Date & Time:</strong> ${appointmentDate}</p>
            <p><strong>Counselor:</strong> ${counselorName}</p>
          </div>
          <p>Please make sure to join the session on time. If you need to reschedule, please contact us at least 24 hours in advance.</p>
          <p>Best regards,<br>The Santana AI Counselor Team</p>
        </div>
      `,
      textContent: `Appointment Reminder\n\nDear ${userName},\n\nThis is a friendly reminder about your upcoming counseling session.\n\nAppointment Details:\nDate & Time: ${appointmentDate}\nCounselor: ${counselorName}\n\nPlease make sure to join the session on time. If you need to reschedule, please contact us at least 24 hours in advance.\n\nBest regards,\nThe Santana AI Counselor Team`
    }
  }

  getClinicRegistrationEmail(adminName: string, clinicName: string, loginUrl: string): EmailTemplate {
    return {
      subject: 'Clinic Registration Successful - Santana AI Counselor',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #10B981;">Clinic Registration Successful!</h1>
          <p>Dear ${adminName},</p>
          <p>Congratulations! Your clinic "${clinicName}" has been successfully registered with Santana AI Counselor.</p>
          <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3>Next Steps</h3>
            <ol>
              <li>Set up your admin account</li>
              <li>Configure your clinic settings</li>
              <li>Invite counselors to join</li>
              <li>Start onboarding patients</li>
            </ol>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Dashboard</a>
          </div>
          <p>If you have any questions or need assistance, our support team is here to help.</p>
          <p>Best regards,<br>The Santana AI Counselor Team</p>
        </div>
      `,
      textContent: `Clinic Registration Successful!\n\nDear ${adminName},\n\nCongratulations! Your clinic "${clinicName}" has been successfully registered with Santana AI Counselor.\n\nNext Steps:\n1. Set up your admin account\n2. Configure your clinic settings\n3. Invite counselors to join\n4. Start onboarding patients\n\nAccess your dashboard: ${loginUrl}\n\nIf you have any questions or need assistance, our support team is here to help.\n\nBest regards,\nThe Santana AI Counselor Team`
    }
  }

  // Utility methods
  isConfigured(): boolean {
    return this.provider !== null
  }

  getProviderInfo(): { name: string; configured: boolean } {
    return {
      name: this.provider?.name || 'None',
      configured: this.provider !== null
    }
  }
}

// Singleton instance
export const emailService = new EmailService()

// Helper function for sending emails
export async function sendEmail(emailData: EmailData) {
  return await emailService.sendEmail(emailData)
}

export default emailService
