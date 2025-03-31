
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import type { RequestHandler } from 'express';
import {  ROLE, type User } from '../types';
import { otpService, userService } from '../services';
import { config } from '../config';
import type { ICreateUserRequest } from '../dto/user';


// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '1d',
  });
};
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
    req.session.phoneNumber = phoneNumber;
    res.status(201).json({ message: 'OTP created: '+ createdOtp?.code });
  } catch(e) {
    res.status(500).json({ message: (e as Error).message });
  }
  
};

const verifyOTP: RequestHandler = async (req, res) => {
  try {
    const phoneNumber: string = req.session.phoneNumber || '';
    if(phoneNumber === '') {
      res.status(400).json({ message: 'Phone number not found' });
      return;
    }
    const code: string  = req.body.code;
    const isValid = await otpService.verify(phoneNumber, code);
    if (!isValid) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }
    // store verified to session -> tracking user is verified or not
    req.session.verified = true;
    res.status(200).json({ message: 'OTP verified' });

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

const createUser: RequestHandler = async (req, res) => {
  const { phoneNumber, verified} = req.session;
  if (!phoneNumber || !verified) {
    res.status(400).json({ message: 'Phone number not found or not verified' });
    return;
  }
  try {
    
    const userRequest: ICreateUserRequest = req.body;
    const data: User = {
      ...userRequest,
      phoneNumber,
      role: ROLE.NORMAL,
      name: 'null',
      email: 'null',
      address: null,
      dateOfBirth: null,
      gender: null,
      comparePassword: async () => false // Provide a default implementation
    }
    const result = await  userService.create(data);
    if(!result._id) {
      res.status(400).json({ message: 'Failed to create user' });
    } 
    // @ts-ignore
    const authenToken = generateToken(result._id.toString());
    res.cookie("authenToken", authenToken, {
      maxAge: config.cookie.maxAge,
      signed: true,
    })

    res.status(201).json(userService.userWithoutPassword(result));
  } catch (error) {
    res.status(400).json({ message: (error  as Error).message });
    
  }
}

// Login User
const loginUser: RequestHandler = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

   const result = await userService.login(phoneNumber, password);
   if(result._id) {
      const authenToken = generateToken(result._id.toString());
      res.cookie("authenToken", authenToken, {
        maxAge: config.cookie.maxAge,
        signed: true,
      })
   }else {
      res.status(400).json({ message: 'Failed to login' });
   }
    res.status(200).json(userService.userWithoutPassword(result));
  } catch (error) {
    res.status(500).json({ message: (error  as Error).message });
  }
};


const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const user = await userService.findById(req.user._id);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(userService.userWithoutPassword(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}
// // // Get User Profile
// const getUserProfile: RequestHandler = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//        res.status(404).json({ message: 'User not found' });
//        return;
//     }

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       phoneNumber: user.phoneNumber,
//       address: user.address,
//       dateOfBirth: user.dateOfBirth,
//       gender: user.gender,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Update User Profile
// const updateUserProfile: RequestHandler = async (req, res) => {
//   try {
    
//     const updateUserData: User = req.body; 
//     const user = await User.findById(req.user._id);
   
//     if (!user) {
//        res.status(404).json({ message: 'User not found' });
//        return;
//     }

//     // Update user fields
//     Object.assign(user, updateUserData);

//     const updatedUser = await user.save();
//     res.json(updatedUser);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ message: error.errors });
//     } else {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   }
// };

// // Get All Users (Admin Only)
// const getAllUsers: RequestHandler = async (req, res) => {
//   try {
//     const users = await User.find({}).select('-password');
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Delete User (Admin Only)
// const deleteUser: RequestHandler = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//        res.status(404).json({ message: 'User not found' });
//        return;
//     }

//     await user.deleteOne();
//     res.json({ message: 'User removed' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


export default {
  registerUser,
  loginUser,
  getUserProfile,
  verifyOTP,
  createUser

}