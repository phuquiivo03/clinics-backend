
import type { RequestHandler } from 'express';
import { Doctor } from '../models/Doctor';
import { z } from 'zod';

// Get All Doctors
const getAllDoctors: RequestHandler = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).populate('user', 'name email');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get Doctor By ID
const getDoctorById: RequestHandler = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a Doctor Profile
const createDoctorProfile: RequestHandler = async (req, res) => {
  // try {
  //   const doctorSchema = z.object({
  //     specialization: z.string(),
  //     experience: z.number(),
  //     qualifications: z.array(z.string()),
  //     bio: z.string(),
  //     consultationFee: z.number(),
  //     availability: z.array(
  //       z.object({
  //         day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  //         startTime: z.string(),
  //         endTime: z.string(),
  //       })
  //     ),
  //   });

  //   const validatedData = doctorSchema.parse(req.body);

  //   // Check if doctor profile already exists
  //   const existingDoctor = await Doctor.findOne({ user: req.user._id });

  //   if (existingDoctor) {
  //     res.status(400).json({ message: 'Doctor profile already exists for this user' });
  //     return;
  //   }

  //   // Create doctor profile
  //   const doctor = await Doctor.create({
  //     user: req.user._id,
  //     ...validatedData,
  //   });

  //   // Update user role to doctor
  //   await User.findByIdAndUpdate(req.user._id, { role: 'doctor' });

  //   res.status(201).json(doctor);
  // } catch (error) {
  //   if (error instanceof z.ZodError) {
  //     res.status(400).json({ message: error.errors });
  //   } else {
  //     console.error(error);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // }
};

// Update Doctor Profile
const updateDoctorProfile: RequestHandler = async (req, res) => {
  try {
    const doctorSchema = z.object({
      specialization: z.string().optional(),
      experience: z.number().optional(),
      qualifications: z.array(z.string()).optional(),
      bio: z.string().optional(),
      consultationFee: z.number().optional(),
      availability: z
        .array(
          z.object({
            day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
            startTime: z.string(),
            endTime: z.string(),
          })
        )
        .optional(),
    });

    const validatedData = doctorSchema.parse(req.body);

    // Find doctor by user ID
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      res.status(404).json({ message: 'Doctor profile not found' });
      return;
    }

    // Update doctor
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { $set: validatedData },
      { new: true }
    );

    res.json(updatedDoctor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Add Review to Doctor
const addDoctorReview: RequestHandler = async (req, res) => {
  try {
    const reviewSchema = z.object({
      rating: z.number().min(1).max(5),
      comment: z.string(),
    });

    const { rating, comment } = reviewSchema.parse(req.body);
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    // Check if user already reviewed
    const alreadyReviewed = doctor.reviews.find(
      (r: any) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Doctor already reviewed' });
      return;
    }

    // Add review
    const review = {
      user: req.user._id,
      rating,
      comment,
      date: new Date(),
    };

    doctor.reviews.push(review);

    // Calculate average rating
    doctor.averageRating =
      doctor.reviews.reduce((acc: any, item: any) => item.rating + acc, 0) / doctor.reviews.length;

    await doctor.save();

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Get Doctor Availability
const getDoctorAvailability: RequestHandler = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId).select('availability');

    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    res.json(doctor.availability);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export default {

  getAllDoctors,
  getDoctorById,
  createDoctorProfile,
  updateDoctorProfile,
  addDoctorReview,
  getDoctorAvailability,
}