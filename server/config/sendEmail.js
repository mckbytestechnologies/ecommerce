import { sendEmail } from "./emailService";

const sendEmailFun=async(to,subject, text,html) => {
    const result = await sendEmail(to, subject, text,html):
    if (result.sucess){
        return true;
    
    }else {
        return false;
    }
}

export default sendEmailFun;