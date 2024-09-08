import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/index";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { ticketId: string } }) {
    await connectToDatabase();

    try {
        const { ticketId } = params;

        if (!ticketId || !mongoose.isValidObjectId(ticketId)) {
            return NextResponse.json(
                createError("Invalid Ticket ID", 400, false),
                { status: 400 }
            );
        }

        const booking = await Booking.findById(ticketId);

        if (!booking) {
            return NextResponse.json(
                createError("Ticket not found", 404, false),
                { status: 404 }
            );
        }

        // Check if the ticket is still valid
        if (new Date() > booking.validity) {
            booking.status = "expired";
            await booking.save();
            return NextResponse.json(
                createError("Ticket has expired", 400, false),
                { status: 400 }
            );
        }

        return NextResponse.json(
            createResponse("Ticket is valid", 200, true, { booking }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error verifying ticket:", error);
        return NextResponse.json(
            createError("Internal Server Error", 500, false, error.message),
            { status: 500 }
        );
    }
}