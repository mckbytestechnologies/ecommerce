import UserModel from "../models/User";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken'
import { sendEmail } from "../config/emailService";

export async function registerUserController(request,response){
  try{
    const {name, email, password} = request.body;
    if(!name || !email || !password){
      return response.status(400).json({
        message : "provide email name password",
        error : true,
        sucess : false
      })
    }
    const user =await UserModel.findOne({email:email})
    if(user{
      return response.json({
        message:"already register email",
        error : true,
        sucess : false

      })
    });

  }catch(error){
    return response.status(500).json({
      message:error.message || error,
      error:true,
      sucess:false
    })
  }

  const veifycode = Math.floor(10000 + Math.random() *900000).to String();
  let user;

  const salt =await bcryptjs.genSalt(10);
  const haspassword = await bcryptjs.hash(password,salt);

  
  user = new UserModel({
    email:email,
    password: password,
    name : name
  });

  await user.save()
  const resp = sendEmailFun(email ,"verify Email","", "your OTP is "+vrifycode);

  const verifyEmail = await sendEmail({
    sendTo : email,
    subject : "Verify email form mckbytes"
    html : verifyemailTemaplate({
      name,
      url : verifyEmailUrl 
    })
  })


  const VerifyEmailUrl = '${process.env.FRONTEND_URL}/verify-email?code=${save?._id}'



}