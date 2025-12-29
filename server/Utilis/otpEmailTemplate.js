export const otpEmailTemplate = (name, otpCode) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - OTP</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 40px;
          color: white;
        }
        .content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          margin-top: 20px;
          color: #333;
        }
        .otp-code {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #1f2937;
          margin: 20px 0;
          font-family: 'Courier New', monospace;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
        .warning {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          padding: 12px;
          margin: 20px 0;
          font-size: 14px;
          color: #92400e;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="margin: 0; font-size: 28px;">Verify Your Email</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Complete your registration</p>
      </div>
      
      <div class="content">
        <h2>Hello ${name},</h2>
        <p>Thank you for registering with us! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
        
        <div class="otp-code">${otpCode}</div>
        
        <div class="warning">
          ⚠️ <strong>Important:</strong> This OTP is valid for 10 minutes only. Do not share this code with anyone.
        </div>
        
        <p>If you didn't request this verification, please ignore this email.</p>
        
        <p>Best regards,<br>The E-commerce Team</p>
      </div>
      
      <div class="footer">
        <p>This email was sent to you because you registered on our platform.</p>
        <p>© ${new Date().getFullYear()} E-commerce. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Verify Your Email - OTP
    
    Hello ${name},
    
    Thank you for registering with us! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:
    
    OTP Code: ${otpCode}
    
    Important: This OTP is valid for 10 minutes only. Do not share this code with anyone.
    
    If you didn't request this verification, please ignore this email.
    
    Best regards,
    The E-commerce Team
  `;

  return { html, text };
};

export const otpVerificationSuccessTemplate = (name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified Successfully</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          padding: 40px;
          color: white;
          text-align: center;
        }
        .content {
          background: white;
          border-radius: 8px;
          padding: 30px;
          margin-top: 20px;
          color: #333;
          text-align: center;
        }
        .success-icon {
          font-size: 64px;
          color: #10b981;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="margin: 0; font-size: 28px;">Email Verified Successfully!</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome to our community</p>
      </div>
      
      <div class="content">
        <div class="success-icon">✅</div>
        <h2>Congratulations ${name}!</h2>
        <p>Your email has been successfully verified. You now have full access to your account.</p>
        
        <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
        
        <p>You can now:</p>
        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
          <li>Browse and purchase products</li>
          <li>Track your orders</li>
          <li>Update your profile</li>
          <li>Receive personalized recommendations</li>
        </ul>
        
        <p>Thank you for joining us!</p>
      </div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} E-commerce. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Email Verified Successfully!
    
    Congratulations ${name}!
    
    Your email has been successfully verified. You now have full access to your account.
    
    You can now:
    - Browse and purchase products
    - Track your orders
    - Update your profile
    - Receive personalized recommendations
    
    Go to your dashboard: ${process.env.FRONTEND_URL}/dashboard
    
    Thank you for joining us!
    
    Best regards,
    The E-commerce Team
  `;

  return { html, text };
};