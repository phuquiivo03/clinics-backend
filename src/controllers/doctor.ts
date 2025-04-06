import type { RequestHandler } from 'express';
import { z } from 'zod';
import { doctorService, userService } from '../services';
import type { ICreateDoctorRequest } from '../dto';
import { ROLE, type Doctor } from '../types';
import { createDoctorSchema } from '../schemas';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';

// Get All Doctors
const getAllDoctors: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const doctors = await doctorService.findAll();
        appExpress.response200(doctors);
    } catch (error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
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
const createDoctorProfile: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
        const validationResult = createDoctorSchema.safeParse(req.body);
        if (!validationResult.success) {
            appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, validationResult.error.errors);
            return;
        }
        
        const doctorRequest = validationResult.data;
        // Check if doctor profile already exists
        const existingDoctor = await doctorService.findOne({ filter: {user: req.user._id} });
        if (existingDoctor) {
            appExpress.response400(ErrorCode.INVALID_REQUEST, { message: 'Doctor profile already exists for this user' });
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

        const createdDoctor = await doctorService.create(doctorData);

        // Update user role to doctor
        await userService.findAndUpdate(req.user._id, { role: ROLE.DOCTOR });
        appExpress.response201(createdDoctor);
    } catch (error) {
        if (error instanceof z.ZodError) {
            appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, error.errors);
        } else {
            appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
        }
    }
};

export default {
    getAllDoctors,
    createDoctorProfile,
}