
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import type { RequestHandler } from 'express';
import {  ROLE, type User } from '../types';
import { otpService, userService } from '../services';
import { config } from '../config';
import type { ICreateUserRequest, IUpdateUserInfoRequest } from '../dto/user';
import UtilsService from '../services/utils';



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
      occupation: null,
      comparePassword: async () => false // Provide a default implementation
    }
    const result = await  userService.create(data);
    if(!result._id) {
      res.status(400).json({ message: 'Failed to create user' });
    } 
    // @ts-ignore
    const authenToken = UtilsService.generateToken(result._id.toString());
    res.cookie("authenToken", authenToken, {
      maxAge: config.cookie.maxAge,
      signed: true,
    })

    res.status(201).json(userService.userWithoutPassword(result));
  } catch (error) {
    res.status(400).json({ message: (error  as Error).message });
    
  }
}



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

const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const userRequest: IUpdateUserInfoRequest = req.body;
    const user = await userService.findById(req.user._id);
    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }
    const updatedUser = await userService.findAndUpdate(
      req.user._id, 
      {
        ...userRequest,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role
      }
    );
    if(!updatedUser || createUser == null) {
      res.status(400).json({ message: 'Failed to update user' });
      return;
    } 
    res.status(200).json(userService.userWithoutPassword(updatedUser));
  } catch(e) {
    res.status(400).json({ message: (e as Error).message });
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
  getUserProfile,
  createUser,
  updateUserProfile
}



