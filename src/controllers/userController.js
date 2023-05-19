const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const isValidEmail = function (Email) {
    return /^([A-Za-z0-9._]{3,}@[A-Za-z]{2,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
  }


const generateOtp = async(req, res)=>{
    try{
    const {email} = req.body;
    if(!email){
        return res.status(400).send({status:false, message:"Please provide email to register"})
    }
    if(!isValidEmail(email)){
        return res.status(400).send({status:false, message:"Please provide valid email to register"})
    };
    let registeredUser = await User.findOne({email:email})
    // email creation /save in database 
    if(!registeredUser){
        await User.create({email:email})
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "kimmikumarisinha@gmail.com",
            pass: "oxwowkhbxbkwlxrn"
        }
    });
    let otpnum = Math.floor(1000 + (Math.random() * 9000));
    let lastOtp = await User.findOne({email:email})

   

    ///ONE MINTUES 

    if(lastOtp.updatedAt && lastOtp.updatedAt.getTime() > Date.now() - 60000){
        return res.status(400).send({status:false, message:"Please wait for one minute"})
    }

  
    await User.findOneAndUpdate({email:email},{otp:otpnum, updatedAt:Date.now()})

    var mailOptions = {
        from: "kimmikumarisinha@gmail.com",
        to: `${req.body.email}`,
        subject: `OTP for login`,
        text: `
        OTP is ${otpnum} to login
    `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }

    });
    return res.status(200).send({status:true, message:`OTP has been sent to ${email}`})
}
catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};





const userLogin = async(req, res)=>{

    try{
    const {email, otp} = req.body;
    if(!email){
        return res.status(400).send({status:false, message:"Please provide email to login"})
    }
    if(!otp){
        return res.status(400).send({status:false, message:"Please provide otp to login"})
    }
    const verifiedUser = await User.findOne({email:email})
    if(verifiedUser.wrongAttempt == 5){
        return res.status(400).send({status:false, message:"Your account has been blocked for 1 hour"})
    }
    if(!verifiedUser){
        return res.status(404).send({status:false, message:"Email does not exists"})
    };
    if(verifiedUser.otp == null || verifiedUser.otp == undefined){
        return res.status(403).send({status:false, message:"OTP session has expired"})
    }
    if(verifiedUser.otp !== otp){
       let invalidAtmpt = await User.findOneAndUpdate({email:email},{$inc:{wrongAttempt:1}},{new:true})
       return res.status(403).send({status:false, message:"OTP is incorrect"})
    };
    let token = jwt.sign({ userId: verifiedUser._id.toString()}, 'kimmi')
    return res.status(200).send({status:false, message:"Login successfull", accessToken:token})
}
catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}

module.exports = {generateOtp, userLogin}