import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
    name: string;
    cost: number;
}

export const SectionSchema: Schema<ISection> = new Schema({
    name: { 
        type: String, 
        required: [true, 'Section name is required'] 
    },
    cost: { 
        type: Number, 
        required: [true, 'Section cost is required'] 
    },
});

export const Section = mongoose.models.Schema || mongoose.model<ISection>('Section', SectionSchema);
