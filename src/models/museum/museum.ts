import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISection } from './section';

export interface ITiming extends Document {
  from: string; // Time in HH:MM format
  to: string;   // Time in HH:MM format
}

export interface IMuseum extends Document {
    owner: mongoose.Types.ObjectId;
    name: string;
    address: string;
    phoneNumber: string;
    timings: {
        weekday: ITiming;
        weekend: ITiming;
    };
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
    isPaymentComplete: boolean; // Indicates if payment is complete
}

const TimingSchema: Schema<ITiming> = new Schema({
    from: { 
        type: String, 
        required: [true, 'Start time is required']
    },
    to: { 
        type: String, 
        required: [true, 'End time is required']
    },
});

const MuseumSchema: Schema<IMuseum> = new Schema(
  {
    owner: { 
        type: Schema.Types.ObjectId, ref: 'MuseumOwner', 
        required: true 
    },
    name: { 
        type: String, 
        required: [true, 'Museum name is required'] 
    },
    address: { 
        type: String, 
        required: [true, 'Address is required'] 
    },
    phoneNumber: { 
        type: String, 
        required: [true, 'Phone number is required'] 
    },
    timings: {
        weekday: { 
            type: TimingSchema, 
            required: [true, 'Weekday timings are required'] 
        },
        weekend: { 
            type: TimingSchema, 
            required: [true, 'Weekend timings are required'] 
        },
    },
    ticketDetails: {
        isSubTicketing: { 
            type: Boolean, 
            required: [true, 'Sub-ticketing info is required'] 
        },
        sections: [{ 
            type: Schema.Types.ObjectId, ref: 'Section' }],
    },
    googleMapsLink: { 
        type: String, 
        required: [true, 'Google Maps link is required'] 
    },
    email: { 
        type: String, 
        required: [true, 'Museum email is required'] 
    },
    socials: {
        instagram: { 
            type: String 
        },
        facebook: { 
            type: String 
        },
        website: { 
            type: String 
        },
    },
    images: [{ 
        type: String, 
        required: [true, 'At least one image is required'] }],
    about: { 
        type: String, 
        required: [true, 'About information is required'] },
    isPaymentComplete: {
        type: Boolean,
        default: true, // For development, change this to `false` in production
    },
},
{ timestamps: true }
);

export const Museum: Model<IMuseum> =
  mongoose.models.Museum || mongoose.model<IMuseum>('Museum', MuseumSchema);
