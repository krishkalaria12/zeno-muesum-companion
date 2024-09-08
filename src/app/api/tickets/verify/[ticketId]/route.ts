import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/index";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectToDatabase();

    try {
        const { ticketId } = req.query;

        if (!ticketId || !mongoose.isValidObjectId(ticketId)) {
        throw createError("Invalid Ticket ID", 400, false);
        }

        const booking = await Booking.findById(ticketId);

        if (!booking) {
            throw createError("Ticket not found", 404, false);
        }

        // Check if the ticket is still valid
        if (new Date() > booking.validity) {
        booking.status = "expired";
        await booking.save();
        return res.status(400).json(createError("Ticket has expired", 400, false));
        }

        return res.status(200).json(createResponse("Ticket is valid", 200, true, { booking }));
    } catch (error: any) {
        console.error("Error verifying ticket:", error);
        return res.status(500).json(createError("Internal Server Error", 500, false, error.message));
    }
}
