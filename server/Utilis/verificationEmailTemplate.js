// utils/verificationEmail.js

// ===============================
// Verification Email Template
// ===============================
export const verificationEmailTemplate = (username, otp) => {
  const preheader = `Your verification code is ${otp} — valid for 10 minutes.`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify your email</title>
  <style>
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img{ -ms-interpolation-mode:bicubic; }
    img{ border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    table{ border-collapse:collapse !important; }
    body{ margin:0 !important; padding:0 !important; width:100% !important; font-family: Arial, Helvetica, sans-serif; background-color:#f5f7fb; color:#333333; }
    .email-wrapper { width:100%; background-color:#f5f7fb; padding:20px 0; }
    .email-content { width:100%; max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 18px rgba(0,0,0,0.06); }
    .email-header { padding:24px; text-align:left; background: linear-gradient(90deg,#ff6b6b,#ff8e53); color:#fff; }
    .brand { font-weight:700; font-size:20px; letter-spacing:0.2px; }
    .email-body { padding:28px 26px; }
    .greeting { font-size:18px; margin:0 0 12px 0; }
    .lead { font-size:14px; margin:0 0 18px 0; color:#555555; line-height:1.5; }
    .otp-card { display:block; width:100%; border-radius:8px; padding:18px; text-align:center; border:1px dashed #e6e9ef; margin:16px 0 20px 0; background: #fbfdff; }
    .otp { font-size:28px; font-weight:700; letter-spacing:4px; margin:6px 0; color:#111827; }
    .otp-note { font-size:12px; color:#6b7280; margin-top:6px; }
    .btn { display:inline-block; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600; background:#ff6b6b; color:#ffffff; margin-top:10px; }
    .email-footer { padding:18px 26px; font-size:12px; color:#8b8f98; text-align:center; background:#fbfdff; border-top:1px solid #f1f3f6; }
    @media only screen and (max-width:480px) {
      .email-header { padding:16px; }
      .email-body { padding:20px; }
      .otp { font-size:24px; }
      .brand { font-size:18px; }
    }
  </style>
</head>
<body>
  <div style="display:none; font-size:1px; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    ${preheader}
  </div>

  <table class="email-wrapper" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center">
        <table class="email-content" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td class="email-header">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="brand">Your Company</div>
                <div style="margin-left:auto; font-size:13px; opacity:0.85;">Verification</div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="email-body">
              <p class="greeting">Hi ${escapeHtml(username || "there")},</p>
              <p class="lead">Use the verification code below to confirm your email address. This code is valid for <strong>10 minutes</strong>. If you didn't request it, you can safely ignore this email.</p>

              <div class="otp-card" role="presentation">
                <div style="font-size:13px; color:#6b7280; margin-bottom:6px;">Your verification code</div>
                <div class="otp">${escapeHtml(otp)}</div>
                <div class="otp-note">Do not share this code with anyone.</div>
              </div>

              <p style="font-size:13px; color:#6b7280; line-height:1.5; margin:0;">
                Need help? Reply to this email and our support team will assist you.
              </p>
            </td>
          </tr>
          <tr>
            <td class="email-footer">
              <div>© ${new Date().getFullYear()} Your Company. All rights reserved.</div>
              <div style="margin-top:6px;">If you did not create an account, no further action is required.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi ${username || "there"},

Your verification code is: ${otp}
This code is valid for 10 minutes.

If you didn't request this, please ignore this email.

— Your Company`;

  return { html, text };
};


// ===============================
// Password Reset Email Template
// ===============================
export const passwordResetTemplate = (username, resetLink) => {
  const preheader = `Password reset requested — click the link to reset your password.`;

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Password Reset</title>
</head>
<body style="font-family:Arial, sans-serif; background:#f5f7fb; margin:0; padding:20px;">
  <table style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:24px;">
    <tr>
      <td>
        <h2 style="color:#111827;">Hello ${escapeHtml(username || "there")},</h2>
        <p style="color:#555;">You requested a password reset. Click the button below to reset your password:</p>
        <p style="text-align:center; margin:20px 0;">
          <a href="${resetLink}" style="display:inline-block; padding:12px 20px; background:#ff6b6b; color:#fff; border-radius:6px; text-decoration:none;">Reset Password</a>
        </p>
        <p style="color:#777; font-size:13px;">If you did not request this, please ignore this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hello ${username || "there"},

You requested a password reset. Click the link below to reset your password:
${resetLink}

If you did not request this, please ignore this email.

— Your Company`;

  return { html, text };
};


// ===============================
// Utility function to escape HTML
// ===============================
function escapeHtml(unsafe) {
  return String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
