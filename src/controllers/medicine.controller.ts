import type { RequestHandler } from 'express';
import { z } from 'zod';
import { Types, type ObjectId } from 'mongoose';
import medicineService from '../services/medicine.service';
import type { Medicine } from '../types/medication';

// Create medicine
const create: RequestHandler = async (req, res) => {
  try {
    const medicineSchema = z.object({
      name: z.string().min(1),
      dosage: z.string().min(1),
      form: z.string().min(1),
      route: z.string().min(1),
    });

    const validatedData = medicineSchema.parse(req.body);

    const medicineData: Medicine = {
      ...validatedData,
      _id: new Types.ObjectId() as any,
    };

    const medicine = await medicineService.create(medicineData);
    res.status(201).json(medicine);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

// Get medicine by ID
const getMedicineById: RequestHandler = async (req, res) => {
  try {
    const medicineId = req.params.id as unknown as ObjectId;
    const medicine = await medicineService.getById(medicineId);

    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all medicines
const getAllMedicines: RequestHandler = async (req, res) => {
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
      const { page = 1, limit = 10, name, dosage, form, route } = req.query;

      // Build filter object based on query parameters
      const filterObj: Record<string, any> = {};
      if (name) filterObj.name = { $regex: name, $options: 'i' }; // Case-insensitive search
      if (dosage) filterObj.dosage = { $regex: dosage, $options: 'i' }; // Case-insensitive search
      if (form) filterObj.form = { $regex: form, $options: 'i' }; // Case-insensitive search
      if (route) filterObj.route = { $regex: route, $options: 'i' }; // Case-insensitive search

      filters = {
        filter: filterObj,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
        sort: { createdAt: -1 }, // Sort by creation date, newest first
      };
    }

    const medicines = await medicineService.getAll(filters);
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update medicine
const updateMedicine: RequestHandler = async (req, res) => {
  try {
    const updateMedicineSchema = z.object({
      name: z.string().min(1).optional(),
      dosage: z.string().min(1).optional(),
      form: z.string().min(1).optional(),
      route: z.string().min(1).optional(),
    });

    const validatedData = updateMedicineSchema.parse(req.body);
    const medicineId = req.params.id as unknown as ObjectId;

    // Check if medicine exists
    const medicine = await medicineService.getById(medicineId);
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    const updatedMedicine = await medicineService.update(medicineId, validatedData);
    res.json(updatedMedicine);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Delete medicine
const deleteMedicine: RequestHandler = async (req, res) => {
  try {
    const medicineId = req.params.id as unknown as ObjectId;

    // Check if medicine exists
    const medicine = await medicineService.getById(medicineId);
    if (!medicine) {
      res.status(404).json({ message: 'Medicine not found' });
      return;
    }

    await medicineService.delete(medicineId);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default {
  create,
  getMedicineById,
  getAllMedicines,
  updateMedicine,
  deleteMedicine,
};
