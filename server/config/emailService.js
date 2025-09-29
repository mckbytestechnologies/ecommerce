const http = require("http")
const nodemailer = reqired("nodemailer");

const transporter = nodemailer.cretaeTransport({
    host:'smpt.gmail.com',
    port:465,
    secure: true,
    auth: {
        user:process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(to, subject, text,html){
    try{
        const info = await transporter.sendMail({
            from: process.env.Email,
            to,
            subject,
            text,
            html,

        });
        return {sucess: true, messageId: info.merssageId};

    }catch(error){
        console.error('Error Sending Email:',error);
        return { sucess:false, error:error.message};
    }
}

module.exports = {sendEmail};