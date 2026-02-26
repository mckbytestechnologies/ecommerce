import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Email service error:", error);
  } else {
    console.log("✅ Email service is ready to send messages");
  }
});

/**
 * Send warranty registration email to admin
 */
export const sendWarrantyEmailToAdmin = async (warrantyData) => {
  try {
    const {
      firstName,
      email,
      mobileNumber,
      productModel,
      purchaseDate,
      registeredAt,
    } = warrantyData;

    const mailOptions = {
      from: `"Warranty Registration" <${process.env.EMAIL}>`,
      to: process.env.EMAIL, // Send to admin email
      subject: `🔔 New Warranty Registration - ${productModel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #D32F2F; display: block; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border-left: 4px solid #D32F2F; }
            .badge { background: #4CAF50; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">🛡️ New Warranty Registration</h1>
            </div>
            <div class="content">
              <div style="text-align:center; margin-bottom:25px;">
                <span class="badge">Pending Verification</span>
              </div>
              
              <h2 style="color:#D32F2F; border-bottom:2px solid #D32F2F; padding-bottom:10px;">Product Information</h2>
              
              <div class="field">
                <span class="label">📦 Product Model/Serial:</span>
                <div class="value">${productModel}</div>
              </div>
              
              <div class="field">
                <span class="label">📅 Purchase Date:</span>
                <div class="value">${new Date(purchaseDate).toLocaleDateString()}</div>
              </div>
              
              <h2 style="color:#D32F2F; border-bottom:2px solid #D32F2F; padding-bottom:10px; margin-top:30px;">Customer Details</h2>
              
              <div class="field">
                <span class="label">👤 Name:</span>
                <div class="value">${firstName}</div>
              </div>
              
              <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value">${email}</div>
              </div>
              
              <div class="field">
                <span class="label">📱 Mobile:</span>
                <div class="value">${mobileNumber}</div>
              </div>
              
              <hr />
              
              <div class="field">
                <span class="label">⏰ Registered At:</span>
                <div class="value">${new Date(registeredAt).toLocaleString()}</div>
              </div>
              
              <div style="background: #FFF3E0; padding:15px; border-radius:8px; margin-top:20px;">
                <p style="margin:0; color:#E65100;">
                  <strong>⚠️ Important:</strong> Please verify the purchase date is within 30 days for warranty activation.
                </p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message from your Warranty Registration System.</p>
              <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Admin email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    throw error;
  }
};

/**
 * Send confirmation email to customer
 */
export const sendWarrantyEmailToCustomer = async (warrantyData) => {
  try {
    const {
      firstName,
      email,
      productModel,
      purchaseDate,
      warrantyEndDate,
    } = warrantyData;

    const mailOptions = {
      from: `"Warranty Support" <${process.env.EMAIL}>`,
      to: email,
      subject: `✅ Warranty Registration Confirmed - ${productModel}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
            .welcome { font-size: 18px; margin-bottom: 20px; }
            .info-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; margin: 20px 0; }
            .label { color: #666; font-size: 14px; }
            .value { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            .button { background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">🎉 Warranty Activated Successfully!</h1>
            </div>
            <div class="content">
              <p class="welcome">Hello <strong>${firstName}</strong>,</p>
              
              <p>Thank you for registering your product with us. Your warranty has been successfully activated.</p>
              
              <div class="info-box">
                <h3 style="color:#4CAF50; margin-top:0;">Warranty Details</h3>
                
                <div class="label">Product:</div>
                <div class="value">${productModel}</div>
                
                <div class="label">Purchase Date:</div>
                <div class="value">${new Date(purchaseDate).toLocaleDateString()}</div>
                
                <div class="label">Warranty Valid Until:</div>
                <div class="value">${new Date(warrantyEndDate).toLocaleDateString()}</div>
              </div>
              
              <div style="background: #FFF3E0; padding:15px; border-radius:8px;">
                <p style="margin:0; color:#E65100;">
                  <strong>📝 Please keep this email for your records.</strong> You'll need your warranty details when making a claim.
                </p>
              </div>
              
              <div style="text-align:center;">
                <a href="#" class="button">View Warranty Details</a>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Customer email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending customer email:", error);
    throw error;
  }
};

/**
 * Send innovation idea email to admin
 */
export const sendInnovationEmail = async (ideaData) => {
  try {
    const { firstName, email, message } = ideaData;

    const mailOptions = {
      from: `"Innovation Ideas" <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `💡 New Innovation Idea from ${firstName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #F57C00; }
            .message-box { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #FF9800; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">💡 New Innovation Idea</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div><strong>${firstName}</strong> (${email})</div>
              </div>
              
              <div class="field">
                <div class="label">Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Innovation email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending innovation email:", error);
    throw error;
  }
};

export default {
  sendWarrantyEmailToAdmin,
  sendWarrantyEmailToCustomer,
  sendInnovationEmail,
};