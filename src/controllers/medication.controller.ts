import type { RequestHandler } from 'express';
import { z } from 'zod';
import { Types, type ObjectId } from 'mongoose';
import medicationService from '../services/medication.service';
import { medicationSchema, updateMedicationSchema } from '../schemas';
import type { Medication } from '../types/medication';

// Create medication
const create: RequestHandler = async (req, res) => {
  try {
    const validatedData = medicationSchema.parse(req.body);

    const medicationData: Medication = {
      ...validatedData,
      _id: new Types.ObjectId() as any,
      medicine: new Types.ObjectId(validatedData.medicine) as any,
    };

    const medication = await medicationService.create(medicationData);
    res.status(201).json(medication);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

// Get medication by ID
const getMedicationById: RequestHandler = async (req, res) => {
  try {
    const medicationId = req.params.id as unknown as ObjectId;
    const medication = await medicationService.getById(medicationId);

    if (!medication) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }

    res.json(medication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all medications
const getAllMedications: RequestHandler = async (req, res) => {
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
        medicine,
        minQuantity,
        maxQuantity,
        frequency,
        duration,
      } = req.query;

      // Build filter object based on query parameters
      const filterObj: Record<string, any> = {};
      if (medicine) filterObj.medicine = medicine;
      if (frequency) filterObj.frequency = { $regex: frequency, $options: 'i' }; // Case-insensitive search
      if (duration) filterObj.duration = { $regex: duration, $options: 'i' }; // Case-insensitive search

      // Quantity range filtering
      if (minQuantity || maxQuantity) {
        filterObj.quantity = {};
        if (minQuantity) filterObj.quantity.$gte = Number(minQuantity);
        if (maxQuantity) filterObj.quantity.$lte = Number(maxQuantity);
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

    const medications = await medicationService.getAll(filters);
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update medication
const updateMedication: RequestHandler = async (req, res) => {
  try {
    const validatedData = updateMedicationSchema.parse(req.body);
    const medicationId = req.params.id as unknown as ObjectId;

    // Check if medication exists
    const medication = await medicationService.getById(medicationId);
    if (!medication) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }

    // Process medicine field if provided
    let updateData: any = { ...validatedData };
    if (validatedData.medicine) {
      updateData.medicine = new Types.ObjectId(validatedData.medicine) as any;
    }

    const updatedMedication = await medicationService.update(medicationId, updateData);
    res.json(updatedMedication);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Delete medication
const deleteMedication: RequestHandler = async (req, res) => {
  try {
    const medicationId = req.params.id as unknown as ObjectId;

    // Check if medication exists
    const medication = await medicationService.getById(medicationId);
    if (!medication) {
      res.status(404).json({ message: 'Medication not found' });
      return;
    }

    await medicationService.delete(medicationId);
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default {
  create,
  getMedicationById,
  getAllMedications,
  updateMedication,
  deleteMedication,
};
