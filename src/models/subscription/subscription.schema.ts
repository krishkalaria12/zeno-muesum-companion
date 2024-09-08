import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  museumOwner: mongoose.Types.ObjectId;
  subscriptionType: 'Monthly' | 'Yearly';
  startDate: Date;
  endDate: Date;
  paymentDetails: mongoose.Types.ObjectId;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    museumOwner: { 
      type: Schema.Types.ObjectId, ref: 'MuseumOwner', 
      required: true 
    },
    subscriptionType: { 
      type: String, 
      enum: ['Monthly', 'Yearly'], 
      required: true 
    },
    startDate: { 
      type: Date, 
      required: [true, 'Start date is required'] 
    },
    endDate: { 
      type: Date, 
      required: [true, 'End date is required'] 
    },
    paymentDetails: { 
      type: Schema.Types.ObjectId, ref: 'Payment' 
    },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
