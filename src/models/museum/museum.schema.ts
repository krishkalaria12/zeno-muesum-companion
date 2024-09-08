import mongoose, { Schema, Document, Model } from "mongoose";
import { ISection, SectionSchema } from "./section.schema";

export interface IMuseum extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  address: string;
  phoneNumber: string;
  timings: string; // Changed to string
  pricingType: string;
  fixedPrice: number;
  ticketDetails: {
    isSubTicketing: boolean;
    sections: ISection[];
  };
  googleMapsLink: string;
  email: string;
  socials: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  images: string[];
  about: string;
  isPaymentComplete: boolean;
  state: string;
  city: string;
}

const MuseumSchema: Schema<IMuseum> = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "MuseumOwner",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Museum name is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    timings: {
      type: String,
      required: [true, "Timings are required"],
    },
    ticketDetails: {
      isSubTicketing: {
        type: Boolean,
        required: [true, "Sub-ticketing info is required"],
      },
      sections: [SectionSchema],
    },
    googleMapsLink: {
      type: String,
      required: [true, "Google Maps link is required"],
    },
    email: {
      type: String,
      required: [true, "Museum email is required"],
    },
    socials: {
      instagram: { type: String },
      facebook: { type: String },
      website: { type: String },
    },
    images: [
      {
        type: String,
        required: [true, "At least one image is required"],
      },
    ],
    about: {
      type: String,
      required: [true, "About information is required"],
    },
    isPaymentComplete: {
      type: Boolean,
      default: true, // For development, change this to `false` in production
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
  },
  { timestamps: true },
);

export const Museum: Model<IMuseum> =
  mongoose.models.Museum || mongoose.model<IMuseum>("Museum", MuseumSchema);
