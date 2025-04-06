import type { RequestHandler } from "express";
import { otpService, userService } from "../services";
import UtilsService from "../services/utils";
import { config } from "../config";
import { CustomExpress } from "../pkg/app/response";
import { ErrorCode } from "../pkg/e/code";
// Register User
const registerUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
    try {
      const phoneNumber: string = req.body.phoneNumber;
      //check if phone number already exists
      const user = await userService.findOne({filter: {phoneNumber}});
      if(user) {
        appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {})
        return;
      }
      // create OTP
      const createdOtp = await otpService.create(phoneNumber);
      if(!createdOtp) {
        appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {})
        return;
      }
      // store phone number to session
      // req.session.phoneNumber = phoneNumber;
      // console.log(req.session.phoneNumber, 'id', req.session.id); 
      appExpress.response201({ message: 'OTP created: '+ createdOtp?.code });
    } catch(e) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {})
    }
    
  };
  
  const verifyOTP: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      // console.log('verify', req.session.phoneNumber, 'id', req.session.id);
      // const phoneNumber: string = req.session.phoneNumber || '';
      // if(phoneNumber === '') {
      //   res.status(400).json({ message: 'Phone number not found' });
      //   return;
      // }
      const code: string  = req.body.code;
      const phoneNumber: string  = req.body.phoneNumber;
      console.log('verify(', phoneNumber, code)
      const isValid = await otpService.verify(phoneNumber, code);
      if (!isValid) {
        appExpress.response401(ErrorCode.OTP_INVALID, {})
        return;
      }
      // store verified to session -> tracking user is verified or not
      // req.session.verified = true;
      appExpress.response201({message: "OTP verified!"})
  
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {})
    }
  }


// Login User
const loginUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
    try {
      const { phoneNumber, password } = req.body;
  
     const result = await userService.login(phoneNumber, password);
     if(result._id) {
        const authenToken = UtilsService.generateToken(result._id.toString());
        // res.cookie("authenToken", authenToken, {
        //   maxAge: config.cookie.maxAge,
        //   signed: true,
        // })
        appExpress.response200({...userService.userWithoutPassword(
          result,
        ), authenToken});
        return;
     }else {
        appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {})
        return;
     }
    } catch (error) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {message: (error as Error).message})
    }
  };
  


export default {
    registerUser,
    verifyOTP,
    loginUser
  }