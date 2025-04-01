
import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE, type User } from '../types';

const DOCUMENT="User"
const COLLECTION="Users"

const userSchema = new Schema<User>(
  {
    name: {
      type: String || null,
      required: true,
    },
    email: {
      type: String || null,
      required: true,
      unique: true,
      lowercase: true,
    },
    occupation: {
      type: String || null,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLE.ADMIN, ROLE.NORMAL, ROLE.DOCTOR],
      default: ROLE.NORMAL,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String || null,
    },
    dateOfBirth: {
      type: Date || null,
    },
    gender: {
      type: String || null,
      enum: ['male', 'female', 'other'],
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  if(this.password) {

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
}
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default model<User>(DOCUMENT, userSchema, COLLECTION);
