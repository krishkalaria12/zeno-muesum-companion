import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMuseumOwner extends Document {
  clerkId: string; 
  name: string;
  personalEmail: string;
  museumEmail: string;
  password: string;
  phoneNumber: string;
  avatar: string;
  museums: mongoose.Types.ObjectId[];
  credits: number;
}

const MuseumOwnerSchema: Schema<IMuseumOwner> = new Schema(
  {
    clerkId: {
      type: String,
      required: [true, 'Clerk ID is required for authentication'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    personalEmail: {
      type: String,
      required: [true, 'Personal email is required'],
      unique: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    museumEmail: {
      type: String,
      required: [true, 'Museum email is required'],
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    museums: [{ type: Schema.Types.ObjectId, ref: 'Museum' }],
    credits: {
      type: Number,
      default: 1000, // Starting credits
      required: true,
    },
  },
  { timestamps: true }
);

export const MuseumOwner: Model<IMuseumOwner> =
  mongoose.models.MuseumOwner ||
  mongoose.model<IMuseumOwner>('MuseumOwner', MuseumOwnerSchema);
