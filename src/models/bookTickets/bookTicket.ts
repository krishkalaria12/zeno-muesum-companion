import mongoose, { Schema, Document, Model } from "mongoose";
import { ISection } from "@/models/museum/section";  // Import the Section model

// Define attendee details for each person booking the ticket
interface IAttendee extends Document {
  name: string;          // Name of the person
  ageGroup: "child" | "adult" | "senior";  // Age group of the person
}

// Define ticket details with section references and costs
interface ISectionDetail extends Document {
  section: mongoose.Types.ObjectId | ISection;  // Reference to the Section model
  quantity: number;                             // Number of people in this section
  totalCost: number;                            // Total cost for this section
}

// Main Ticket Booking schema interface
export interface IBooking extends Document {
  museum: mongoose.Types.ObjectId;              // Reference to the Museum collection
  user: mongoose.Types.ObjectId;                // Reference to the user who made the booking
  attendees: IAttendee[];                       // List of attendees (name and age group)
  sections: ISectionDetail[];                   // Sections with quantity and total cost
  totalCost: number;                            // Total cost for the booking
  qrCode: string;                               // QR code generated after ticket booking
  validity: Date;                               // Ticket validity (expiry date/time)
  status: "booked" | "expired" | "cancelled";   // Booking status
  createdAt: Date;                              // Booking creation date
  updatedAt: Date;                              // Last update timestamp
  paymentStatus: "pending" | "completed" | "failed";  // Payment status for the booking
}

// Attendee sub-schema
const AttendeeSchema: Schema<IAttendee> = new Schema({
  name: {
    type: String,
    required: [true, "Attendee name is required"],
    trim: true,
  },
  ageGroup: {
    type: String,
    enum: ["child", "adult", "senior"],
    required: [true, "Attendee age group is required"],
  },
});

// Section detail sub-schema with reference to Section model and total cost calculation
const SectionDetailSchema: Schema<ISectionDetail> = new Schema({
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
    required: [true, "Section reference is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required for this section"],
    min: [1, "At least one person must be in this section"],
  },
  totalCost: {
    type: Number,
    required: [true, "Total cost is required for this section"],
    min: [0, "Total cost cannot be negative"],
  },
});

// Main Booking schema
const BookingSchema: Schema<IBooking> = new Schema(
  {
    museum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Museum",
      required: [true, "Museum reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    attendees: [AttendeeSchema],  // List of attendees with names and age groups
    sections: [SectionDetailSchema],  // Section details (linked to Section model)
    totalCost: {
      type: Number,
      required: [true, "Total cost of the booking is required"],
      min: [0, "Total cost cannot be negative"],
    },
    qrCode: {
      type: String,
      required: [true, "QR code is required for ticket validation"],
    },
    validity: {
      type: Date,
      required: [true, "Ticket validity date is required"],
      validate: {
        validator: function (this: IBooking, value: Date): boolean {
          return value > new Date();  // Ensure the validity is a future date
        },
        message: "Ticket validity must be a future date",
      },
    },
    status: {
      type: String,
      enum: ["booked", "expired", "cancelled"],
      default: "booked",
      required: [true, "Booking status is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      required: [true, "Payment status is required"],
    },
  },
  { timestamps: true }  // Automatically manage createdAt and updatedAt
);

// Pre-save hook to update the "updatedAt" timestamp automatically before saving
BookingSchema.pre<IBooking>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Compile and export the model
export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
