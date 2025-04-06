
import type { RequestHandler } from 'express';
import { z } from 'zod';
import { doctorService, userService } from '../services';
import type { ICreateDoctorRequest } from '../dto';
import { ROLE, type Doctor } from '../types';
import { createDoctorSchema } from '../schemas';

// Get All Doctors
const getAllDoctors: RequestHandler = async (req, res) => {
  try {
    const doctors = await doctorService.findAll();
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// // Get Doctor By ID
// const getDoctorById: RequestHandler = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');

//     if (!doctor) {
//       res.status(404).json({ message: 'Doctor not found' });
//       return;
//     }

//     res.json(doctor);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// Create a Doctor Profile
const createDoctorProfile: RequestHandler = async (req, res) => {
  try {

    const validationResult = createDoctorSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ message: 'Validation failed', errors: validationResult.error.errors });
      return;
    }
    
    const doctorRequest = validationResult.data;
    // Check if doctor profile already exists
    const existingDoctor = await doctorService.findOne({ filter: {user: req.user._id} });
    if (existingDoctor) {
      res.status(400).json({ message: 'Doctor profile already exists for this user' });
      return;
    }

    // Create doctor profile
    const doctorData: Partial<Doctor> = {
      user: req.user._id,
      ...doctorRequest,
      averageRating: 0,
      reviews: [],
      availability: [],
      bio: 'undefined', // Ensure required fields are included
    };
    console.log('doctor controller')

    const createdDoctor = await doctorService.create(doctorData);

    // Update user role to doctor
    await userService.findAndUpdate(req.user._id, { role: ROLE.DOCTOR });
    res.status(201).json(createdDoctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};




export default {

  getAllDoctors,
  createDoctorProfile,

}