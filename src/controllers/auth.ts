import type { RequestHandler } from "express";
import { otpService, userService } from "../services";
import UtilsService from "../services/utils";
import { config } from "../config";

// Register User
const registerUser: RequestHandler = async (req, res) => {
    try {
      const phoneNumber: string = req.body.phoneNumber;
      //check if phone number already exists
      const user = await userService.findOne({filter: {phoneNumber}});
      if(user) {
        res.status(400).json({ message: 'Phone number already exists' });
        return;
      }
      // create OTP
      const createdOtp = await otpService.create(phoneNumber);
      if(!createdOtp) {
        res.status(500).json({ message: 'Failed to create OTP' });
      }
      // store phone number to session
      // req.session.phoneNumber = phoneNumber;
      // console.log(req.session.phoneNumber, 'id', req.session.id); 
      res.status(201).json({ message: 'OTP created: '+ createdOtp?.code });
    } catch(e) {
      res.status(500).json({ message: (e as Error).message });
    }
    
  };
  
  const verifyOTP: RequestHandler = async (req, res) => {
    try {
      // console.log('verify', req.session.phoneNumber, 'id', req.session.id);
      // const phoneNumber: string = req.session.phoneNumber || '';
      // if(phoneNumber === '') {
      //   res.status(400).json({ message: 'Phone number not found' });
      //   return;
      // }
      const code: string  = req.body.code;
      const phoneNumber: string  = req.body.phoneNumber;
      const isValid = await otpService.verify(phoneNumber, code);
      if (!isValid) {
        res.status(400).json({ message: 'Invalid OTP' });
        return;
      }
      // store verified to session -> tracking user is verified or not
      // req.session.verified = true;
      // res.status(200).json({ message: 'OTP verified' });
  
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }


// Login User
const loginUser: RequestHandler = async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
  
     const result = await userService.login(phoneNumber, password);
     if(result._id) {
        const authenToken = UtilsService.generateToken(result._id.toString());
        // res.cookie("authenToken", authenToken, {
        //   maxAge: config.cookie.maxAge,
        //   signed: true,
        // })
        res.status(200).json({...userService.userWithoutPassword(
          result,
        ), authenToken});
        return;
     }else {
        res.status(400).json({ message: 'Failed to login' });
        return;
     }
    } catch (error) {
      res.status(500).json({ message: (error  as Error).message });
    }
  };
  


export default {
    registerUser,
    verifyOTP,
    loginUser
  }