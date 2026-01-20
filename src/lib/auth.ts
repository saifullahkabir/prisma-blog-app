import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <no-reply@prismablog.com>',
          to: user.email,
          subject: "Verify your email",
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <!-- Main Card -->
        <table width="100%" max-width="520px" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;padding:48px 40px;box-shadow:0 20px 60px rgba(0,0,0,0.15);">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;color:#1f2937;font-size:28px;font-weight:700;">Verify Your Email</h1>
              <p style="margin:8px 0 0;color:#6b7280;font-size:15px;">Prisma Blog Account</p>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.6;">
                Hello <strong style="color:#111827;">${user.name || "there"}</strong>,
              </p>
              <p style="margin:0;color:#4b5563;font-size:16px;line-height:1.6;">
                Welcome to Prisma Blog! We're excited to have you on board. 
                To complete your registration and start exploring, please verify your email address.
              </p>
            </td>
          </tr>

          <!-- Verification Button -->
          <tr>
            <td align="center" style="padding:32px 0;">
              <a href="${verificationUrl}"
                style="
                  background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color:#ffffff;
                  padding:16px 36px;
                  text-decoration:none;
                  border-radius:10px;
                  font-size:16px;
                  font-weight:600;
                  display:inline-block;
                  transition:all 0.3s ease;
                  box-shadow:0 4px 14px rgba(102, 126, 234, 0.4);
                "
                onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.5)';"
                onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 14px rgba(102, 126, 234, 0.4)';">
                Verify Email Address
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:24px 0;">
              <div style="border-top:1px solid #e5e7eb;"></div>
            </td>
          </tr>

          <!-- Alternative Link -->
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0 0 12px;color:#6b7280;font-size:14px;font-weight:500;">
                Or copy and paste this link:
              </p>
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;word-break:break-all;">
                <a href="${verificationUrl}" 
                  style="color:#667eea;text-decoration:none;font-size:14px;font-family:monospace;">
                  ${verificationUrl}
                </a>
              </div>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#92400e;font-size:14px;line-height:1.5;">
                ⏰ <strong>Important:</strong> This verification link will expire in 24 hours.
              </p>
            </td>
          </tr>

          <!-- Help Text -->
          <tr>
            <td style="padding-top:16px;">
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                If you didn't create this account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;border-top:1px solid #e5e7eb;">
              <table width="100%">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">
                      Need help? <a href="mailto:support@prismablog.com" style="color:#667eea;text-decoration:none;">Contact Support</a>
                    </p>
                    <p style="margin:0;color:#9ca3af;font-size:12px;">
                      © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
                    </p>
                    <p style="margin:8px 0 0;color:#9ca3af;font-size:11px;">
                      123 Blog Street, Digital City, DC 10001
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
        <!-- Bottom Note -->
        <table width="100%" max-width="520px" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td align="center">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:12px;">
                This email was sent to ${user.email}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
        });

        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
});
