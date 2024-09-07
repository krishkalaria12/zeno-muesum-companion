import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  amount: number;
  date: Date;
  paymentMethod: string;
  transactionId: string;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    amount: { 
      type: Number, 
      required: [true, 'Payment amount is required'] 
    },
    date: { 
      type: Date, 
      required: [true, 'Payment date is required'] 
    },
    paymentMethod: { 
      type: String, 
      required: [true, 'Payment method is required'] 
    },
    transactionId: { 
      type: String, 
      required: [true, 'Transaction ID is required'] 
    },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
