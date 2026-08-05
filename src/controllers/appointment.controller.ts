// import type { RequestHandler } from 'express';
// import { Appointment } from '../models/Appointment';
// import { Doctor } from '../models/doctor';
// import { z } from 'zod';

// // Get all appointments for a user
// const getUserAppointments: RequestHandler = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ patient: req.user._id })
//       .populate('doctor', 'user specialization consultationFee')
//       .populate({
//         path: 'doctor',
//         populate: {
//           path: 'user',
//           select: 'name email',
//         },
//       })
//       .sort({ date: 1 });

//     res.json(appointments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Get all appointments for a doctor
// const getDoctorAppointments: RequestHandler = async (req, res) => {
//   try {
//     // Find doctor by user ID
//     const doctor = await Doctor.findOne({ user: req.user._id });

//     if (!doctor) {
//       res.status(404).json({ message: 'Doctor profile not found' });
//       return;
//     }

//     const appointments = await Appointment.find({ doctor: doctor._id })
//       .populate('patient', 'name email')
//       .sort({ date: 1 });

//     res.json(appointments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Create new appointment
// const createAppointment: RequestHandler = async (req, res) => {
//   try {
//     const appointmentSchema = z.object({
//       doctor: z.string(),
//       date: z.string().transform((val:string) => new Date(val)),
//       startTime: z.string(),
//       endTime: z.string(),
//       symptoms: z.string().optional(),
//       notes: z.string().optional(),
//     });

//     const validatedData = appointmentSchema.parse(req.body);

//     // Check if doctor exists
//     const doctor = await Doctor.findById(validatedData.doctor);

//     if (!doctor) {
//       res.status(404).json({ message: 'Doctor not found' });
//       return ;
//     }

//     // Check if selected time slot is available
//     // Here you would add logic to check the doctor's availability

//     // Create appointment
//     const appointment = await Appointment.create({
//       patient: req.user._id,
//       doctor: validatedData.doctor,
//       date: validatedData.date,
//       startTime: validatedData.startTime,
//       endTime: validatedData.endTime,
//       symptoms: validatedData.symptoms,
//       notes: validatedData.notes,
//     });

//     res.status(201).json(appointment);
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       res.status(400).json({ message: (error as Error).message });
//     } else {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
//   }
// };

// // Update appointment status
// const updateAppointmentStatus: RequestHandler = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const appointmentId = req.params.id;

//     if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
//       res.status(400).json({ message: 'Invalid status' });
//       return ;
//     }

//     const appointment = await Appointment.findById(appointmentId);

//     if (!appointment) {
//       res.status(404).json({ message: 'Appointment not found' });
//       return ;
//     }

//     // Check permissions (patient can only cancel, doctor can update any status)
//     const doctor = await Doctor.findOne({ user: req.user._id });
//     const isDoctor = !!doctor && doctor._id.toString() === appointment.doctor.toString();
//     const isPatient = req.user._id.toString() === appointment.patient.toString();

//     if (!isDoctor && !isPatient) {
//       res.status(403).json({ message: 'Not authorized' });
//       return ;
//     }

//     // Patient can only cancel their appointment
//     if (isPatient && status !== 'cancelled') {
//        res.status(403).json({ message: 'Patients can only cancel appointments' });
//        return;
//     }

//     appointment.status = status;
//     await appointment.save();

//     res.json(appointment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Update medical information (doctor only)
// const updateMedicalInfo: RequestHandler = async (req, res) => {
//   try {
//     const { diagnosis, prescription } = req.body;
//     const appointmentId = req.params.id;

//     // Find doctor by user ID
//     const doctor = await Doctor.findOne({ user: req.user._id });

//     if (!doctor) {
//        res.status(403).json({ message: 'Not authorized as doctor' });
//        return;
//     }

//     const appointment = await Appointment.findById(appointmentId);

//     if (!appointment) {
//        res.status(404).json({ message: 'Appointment not found' });
//        return;
//     }

//     // Check if this doctor owns the appointment
//     if (doctor._id.toString() !== appointment.doctor.toString()) {
//        res.status(403).json({ message: 'Not authorized to update this appointment' });
//        return;
//     }

//     if (diagnosis) appointment.diagnosis = diagnosis;
//     if (prescription) appointment.prescription = prescription;

//     const updatedAppointment = await appointment.save();

//     res.json(updatedAppointment);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Delete appointment
// const deleteAppointment: RequestHandler = async (req, res) => {
//   try {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//       res.status(404).json({ message: 'Appointment not found' });
//       return;
//     }

//     // Only the patient or doctor can delete the appointment
//     const doctor = await Doctor.findOne({ user: req.user._id });
//     const isDoctor = !!doctor && doctor._id.toString() === appointment.doctor.toString();
//     const isPatient = req.user._id.toString() === appointment.patient.toString();

//     if (!isDoctor && !isPatient) {
//       res.status(403).json({ message: 'Not authorized' });
//       return;
//     }

//     await appointment.deleteOne();
//     res.json({ message: 'Appointment removed' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// export default {
//  getUserAppointments,
//  getDoctorAppointments,
//   createAppointment,
//   updateAppointmentStatus,
//   updateMedicalInfo,
//   deleteAppointment,
// }
