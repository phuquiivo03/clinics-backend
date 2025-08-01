import type { RequestHandler } from 'express';
import { z } from 'zod';
import { doctorService, userService } from '../services/index.service';
import type { ICreateDoctorRequest } from '../dto';
import { ROLE, type Doctor } from '../types';
import { createDoctorSchema } from '../schemas';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { ObjectId } from 'mongoose';

// Get All Doctors
const getAllDoctors: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  
  try {
    // Parse options from query parameter if provided, otherwise use default options
    let options: MongooseFindManyOptions = {
      sort: { createdAt: -1 }, // Sort by creation date, newest first
      pagination: {
        page: 1,
        limit: 10
      },
      populateOptions: {
        path: 'specialization',
        select: ['name', 'description'],
      },
    };

    // If options are provided as a JSON string, parse them
    if (req.query.options) {
      try {
        options = JSON.parse(req.query.options as string) as MongooseFindManyOptions;
        // Ensure population is maintained if not explicitly provided
        if (!options.populateOptions) {
          options.populateOptions = {
            path: 'specialization',
            select: ['name', 'description'],
          };
        }
      } catch (error) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
          message: 'Invalid options format. Please provide a valid JSON string.'
        });
      }
    } else {
      // Handle individual query parameters if options is not provided
      const { 
        page = 1, 
        limit = 10, 
        specialization,
        minExperience,
        maxExperience,
        minConsultationFee,
        maxConsultationFee,
        minRating,
        bio
      } = req.query;
      
      // Build filter object based on query parameters
      const filter: Record<string, any> = {};
      if (specialization) filter.specialization = specialization;
      if (bio) filter.bio = { $regex: bio, $options: 'i' }; // Case-insensitive search
      
      // Experience range filtering
      if (minExperience || maxExperience) {
        filter.experience = {};
        if (minExperience) filter.experience.$gte = Number(minExperience);
        if (maxExperience) filter.experience.$lte = Number(maxExperience);
      }
      
      // Consultation fee range filtering
      if (minConsultationFee || maxConsultationFee) {
        filter.consultationFee = {};
        if (minConsultationFee) filter.consultationFee.$gte = Number(minConsultationFee);
        if (maxConsultationFee) filter.consultationFee.$lte = Number(maxConsultationFee);
      }
      
      // Minimum rating filtering
      if (minRating) {
        filter.averageRating = { $gte: Number(minRating) };
      }
      
      options = {
        filter,
        pagination: {
          page: Number(page),
          limit: Number(limit)
        },
        sort: { createdAt: -1 }, // Sort by creation date, newest first
        populateOptions: {
          path: 'specialization',
          select: ['name', 'description'],
        },
      };
    }

    const doctors = await doctorService.findMany(options);
    appExpress.response200(doctors);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
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
    const existingDoctor = await doctorService.findOne({ filter: { user: req.user._id } });
    if (existingDoctor) {
      appExpress.response400(ErrorCode.INVALID_REQUEST, {
        message: 'Doctor profile already exists for this user',
      });
      return;
    }

    // Create doctor profile
    const doctorData: Partial<Doctor> = {
      user: req.user._id,
      ...doctorRequest,
      specialization: doctorRequest.specialization as unknown as ObjectId,
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

const findBySpecialization: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const { specialization } = req.params;
    const options: MongooseFindManyOptions = {
      filter: { specialization: specialization as unknown as ObjectId },
    };
    const doctors = await doctorService.findMany(options);
    appExpress.response200(doctors);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

export default {
  getAllDoctors,
  createDoctorProfile,
  findBySpecialization,
};
