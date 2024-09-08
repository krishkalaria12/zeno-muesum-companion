import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
    sender: 'bot' | 'user';
    message: string;
    timestamp: Date;
    action?: string; // e.g., "book_ticket", "cancel_ticket"
    intent?: string; // e.g., "inquire_ticket_price"
}

export interface IChat extends Document {
    museumId: mongoose.Types.ObjectId;  // Reference to the Museum
    userId?: mongoose.Types.ObjectId;    // Optional: User's ID if logged in
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    sender: {
        type: String,
        enum: ['bot', 'user'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        required: false
    },
    intent: {
        type: String,
        required: false
    }
}, { _id: false });

const ChatSchema: Schema<IChat> = new Schema({
    museumId: {
        type: Schema.Types.ObjectId,
        ref: 'Museum',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Can be null for guest users
    },
    messages: [MessageSchema],
}, {
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Index for efficient retrieval of chats based on museumId and userId
ChatSchema.index({ museumId: 1, userId: 1 });

export const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);