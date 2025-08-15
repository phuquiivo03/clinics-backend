import type { RequestHandler } from 'express';
import { z } from 'zod';

import { Types, type ObjectId } from 'mongoose';
import doctorService from '../services/doctor.service';
import prescriptionService from '../services/prescription.service';
import { prescriptionSchema, updatePrescriptionSchema } from '../schemas';
import type { Medication } from '../types/medication';
import type { Prescription } from '../types';

// Create prescription
const create: RequestHandler = async (req, res) => {
  try {
    const validatedData = prescriptionSchema.parse(req.body);

    // Find doctor by user ID
    const doctor = await doctorService.findOne({ filter: { user: req.user._id } });
    if (!doctor) {
      res.status(403).json({ message: 'Not authorized as doctor' });
      return;
    }

    // Process medications - they can be ObjectIds or full Medication objects
    const medications: Array<Medication | ObjectId> = validatedData.medications.map((med) => {
      if (typeof med === 'string') {
        return new Types.ObjectId(med) as unknown as ObjectId;
      } else {
        // It's a Medication object, convert medicine field to ObjectId if it's a string
        const medication: Medication = {
          ...med,
          medicine:
            typeof med.medicine === 'string'
              ? (new Types.ObjectId(med.medicine) as unknown as ObjectId)
              : med.medicine,
        };
        return medication;
      }
    });

    const prescriptionData: Prescription = {
      ...validatedData,
      _id: new Types.ObjectId().toString(),
      patient: validatedData.patient as unknown as ObjectId,
      medications,
      doctor: doctor._id as ObjectId,
      dateIssued: new Date().toISOString(),
      isPaid: false,
    };

    const prescription = await prescriptionService.create(prescriptionData);
    res.status(201).json(prescription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

// Get prescription by ID
const getPrescriptionById: RequestHandler = async (req, res) => {
  try {
    const prescriptionId = req.params.id as unknown as ObjectId;
    const prescription = await prescriptionService.getById(prescriptionId);

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    res.json(prescription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get patient prescriptions
const getPatientPrescriptions: RequestHandler = async (req, res) => {
  try {
    const patientId = req.user._id as unknown as ObjectId;
    const prescriptions = await prescriptionService.getByPatientId(patientId);
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get doctor prescriptions
const getDoctorPrescriptions: RequestHandler = async (req, res) => {
  try {
    const doctor = await doctorService.findOne({ filter: { user: req.user._id } });
    if (!doctor) {
      res.status(403).json({ message: 'Not authorized as doctor' });
      return;
    }

    const prescriptions = await prescriptionService.getByDoctorId(
      doctor._id as unknown as ObjectId,
    );
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update prescription
const updatePrescription: RequestHandler = async (req, res) => {
  try {
    const validatedData = updatePrescriptionSchema.parse(req.body);
    const prescriptionId = req.params.id as unknown as ObjectId;

    // Find doctor by user ID
    const doctor = await doctorService.findOne({ filter: { user: req.user._id } });
    if (!doctor) {
      res.status(403).json({ message: 'Not authorized as doctor' });
      return;
    }

    // Check if prescription exists and belongs to this doctor
    const prescription = await prescriptionService.getById(prescriptionId);
    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    if ((prescription.doctor as unknown as string) !== (doctor._id as unknown as string)) {
      res.status(403).json({ message: 'Not authorized to update this prescription' });
      return;
    }

    // Process medications if provided
    let medications: Array<Medication | ObjectId> | undefined;
    if (validatedData.medications) {
      medications = validatedData.medications.map((med) => {
        if (typeof med === 'string') {
          return new Types.ObjectId(med) as unknown as ObjectId;
        } else {
          // It's a Medication object, convert medicine field to ObjectId if it's a string
          const medication: Medication = {
            ...med,
            medicine:
              typeof med.medicine === 'string'
                ? (new Types.ObjectId(med.medicine) as unknown as ObjectId)
                : med.medicine,
          };
          return medication;
        }
      });
    }

    const updateData: Partial<Prescription> = {
      ...validatedData,
      medications,
    };

    const updatedPrescription = await prescriptionService.update(prescriptionId, updateData);
    res.json(updatedPrescription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Update payment status
const updatePaymentStatus: RequestHandler = async (req, res) => {
  try {
    const paymentSchema = z.object({
      isPaid: z.boolean(),
    });

    const { isPaid } = paymentSchema.parse(req.body);
    const prescriptionId = req.params.id as unknown as ObjectId;

    const updatedPrescription = await prescriptionService.updatePaymentStatus(
      prescriptionId,
      isPaid,
    );

    if (!updatedPrescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    res.json(updatedPrescription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Get all prescriptions (admin only)
const getAllPrescriptions: RequestHandler = async (req, res) => {
  try {
    // Parse options from query parameter if provided, otherwise use default options
    let filters: any = {
      sort: { createdAt: -1 }, // Sort by creation date, newest first
      pagination: {
        page: 1,
        limit: 10,
      },
    };

    // If options are provided as a JSON string, parse them
    if (req.query.options) {
      try {
        filters = JSON.parse(req.query.options as string);
      } catch (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid options format. Please provide a valid JSON string.',
        });
        return;
      }
    } else {
      // Handle individual query parameters if options is not provided
      const {
        page = 1,
        limit = 10,
        isPaid,
        startDate,
        endDate,
        patient,
        doctor,
        diagnosis,
        minTotalCost,
        maxTotalCost,
      } = req.query;

      // Build filter object based on query parameters
      const filterObj: Record<string, any> = {};
      if (isPaid !== undefined) filterObj.isPaid = isPaid === 'true';
      if (patient) filterObj.patient = patient;
      if (doctor) filterObj.doctor = doctor;
      if (diagnosis) filterObj.diagnosis = { $regex: diagnosis, $options: 'i' }; // Case-insensitive search

      // Date range filtering
      if (startDate || endDate) {
        filterObj.createdAt = {};
        if (startDate) filterObj.createdAt.$gte = new Date(startDate as string);
        if (endDate) filterObj.createdAt.$lte = new Date(endDate as string);
      }

      // Total cost range filtering
      if (minTotalCost || maxTotalCost) {
        filterObj.totalCost = {};
        if (minTotalCost) filterObj.totalCost.$gte = Number(minTotalCost);
        if (maxTotalCost) filterObj.totalCost.$lte = Number(maxTotalCost);
      }

      filters = {
        filter: filterObj,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
        sort: { createdAt: -1 }, // Sort by creation date, newest first
      };
    }

    const prescriptions = await prescriptionService.getAll(filters);
    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete prescription
const deletePrescription: RequestHandler = async (req, res) => {
  try {
    const prescriptionId = req.params.id as unknown as ObjectId;

    // Find doctor by user ID
    const doctor = await doctorService.findOne({ filter: { user: req.user._id } });
    if (!doctor) {
      res.status(403).json({ message: 'Not authorized as doctor' });
      return;
    }

    // Check if prescription exists and belongs to this doctor
    const prescription = await prescriptionService.getById(prescriptionId);
    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    if ((prescription.doctor as unknown as string) !== (doctor._id as unknown as string)) {
      res.status(403).json({ message: 'Not authorized to delete this prescription' });
      return;
    }

    await prescriptionService.delete(prescriptionId);
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default {
  create,
  getPrescriptionById,
  getPatientPrescriptions,
  getDoctorPrescriptions,
  updatePrescription,
  updatePaymentStatus,
  getAllPrescriptions,
  deletePrescription,
};
