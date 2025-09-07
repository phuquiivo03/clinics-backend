import type { RequestHandler } from 'express';
import { z } from 'zod';
import { Types, type ObjectId } from 'mongoose';
import icdService from '../services/icd.service';
import { icdSchema, updateIcdSchema, searchIcdSchema, createManyIcdSchema } from '../schemas/icd';
import type { ICD } from '../types/icd';

// Create ICD
const create: RequestHandler = async (req, res) => {
  try {
    const validatedData = icdSchema.parse(req.body);

    const icdData: ICD = {
      ...validatedData,
      _id: new Types.ObjectId() as any,
    };

    const icd = await icdService.create(icdData);
    res.status(201).json(icd);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

// Create multiple ICDs
const createMany: RequestHandler = async (req, res) => {
  try {
    const validatedData = createManyIcdSchema.parse(req.body);
    const { icds } = validatedData;

    // Add ObjectId to each ICD
    const icdDataArray: ICD[] = icds.map(icd => ({
      ...icd,
      _id: new Types.ObjectId() as any,
    }));

    const createdICDs = await icdService.createMany(icdDataArray);
    res.status(201).json({
      message: `Successfully created ${createdICDs?.length || 0} ICDs`,
      data: createdICDs,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: (error as Error).message });
    }
  }
};

// Get ICD by ID
const getICDById: RequestHandler = async (req, res) => {
  try {
    const icdId = req.params.id as unknown as ObjectId;
    const icd = await icdService.getById(icdId);

    if (!icd) {
      res.status(404).json({ message: 'ICD not found' });
      return;
    }

    res.json(icd);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get ICD by code
const getICDByCode: RequestHandler = async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code) {
      res.status(400).json({ message: 'Code parameter is required' });
      return;
    }
    
    const icd = await icdService.getByCode(code);

    if (!icd) {
      res.status(404).json({ message: 'ICD not found' });
      return;
    }

    res.json(icd);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all ICDs
const getAllICDs: RequestHandler = async (req, res) => {
  try {
    // Parse options from query parameter if provided, otherwise use default options
    let filters: any = {
      sort: { code: 1 }, // Sort by code alphabetically
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
        code,
        range,
        title,
        sortBy = 'code',
        sortOrder = 'asc',
      } = req.query;

      // Build filter object based on query parameters
      const filterObj: Record<string, any> = {};
      if (code) filterObj.code = { $regex: code, $options: 'i' }; // Case-insensitive search
      if (range) filterObj.range = { $regex: range, $options: 'i' }; // Case-insensitive search
      if (title) filterObj.title = { $regex: title, $options: 'i' }; // Case-insensitive search

      // Build sort object
      const sortObj: Record<string, any> = {};
      sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

      filters = {
        filter: filterObj,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
        sort: sortObj,
      };
    }

    const icds = await icdService.getAll(filters);
    res.json(icds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search ICDs by code, title, or range
const searchICDs: RequestHandler = async (req, res) => {
  try {
    const validatedData = searchIcdSchema.parse(req.body);
    const { query } = validatedData;

    // Parse additional options from query parameters
    const {
      page = 1,
      limit = 10,
      sortBy = 'code',
      sortOrder = 'asc',
    } = req.query;

    // Build sort object
    const sortObj: Record<string, any> = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const options = {
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
      sort: sortObj,
    };

    const icds = await icdService.searchByCodeOrTitle(query, options);
    res.json(icds);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Update ICD
const updateICD: RequestHandler = async (req, res) => {
  try {
    const validatedData = updateIcdSchema.parse(req.body);
    const icdId = req.params.id as unknown as ObjectId;

    // Check if ICD exists
    const icd = await icdService.getById(icdId);
    if (!icd) {
      res.status(404).json({ message: 'ICD not found' });
      return;
    }

    const updatedICD = await icdService.update(icdId, validatedData);
    res.json(updatedICD);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// Delete ICD
const deleteICD: RequestHandler = async (req, res) => {
  try {
    const icdId = req.params.id as unknown as ObjectId;

    // Check if ICD exists
    const icd = await icdService.getById(icdId);
    if (!icd) {
      res.status(404).json({ message: 'ICD not found' });
      return;
    }

    await icdService.delete(icdId);
    res.json({ message: 'ICD deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export default {
  create,
  createMany,
  getICDById,
  getICDByCode,
  getAllICDs,
  searchICDs,
  updateICD,
  deleteICD,
};