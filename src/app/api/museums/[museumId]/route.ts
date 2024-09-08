import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Museum } from "@/models/index";
import mongoose from "mongoose";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";

export async function GET(request: NextRequest) {
    await connectToDatabase();  // Ensure the database connection is established

    try {
        const url = new URL(request.url);
        const museumId = url.pathname.split("museums/")[1];

        // Validate the museum ID
        if (!museumId || !mongoose.isValidObjectId(museumId)) {
            return NextResponse.json(
                createError("Invalid Museum ID", 400, false),
                { status: 400 }
            );
        }

        console.log(museumId);
        

        // MongoDB Aggregation Pipeline to fetch museum details
        const pipeline = [
            {
                $match: { _id: new mongoose.Types.ObjectId(museumId) },
            },
            {
                $lookup: {
                    from: "sections",
                    localField: "ticketDetails.sections",
                    foreignField: "_id",
                    as: "sectionsInfo",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    address: 1,
                    phoneNumber: 1,
                    timings: 1,
                    googleMapsLink: 1,
                    email: 1,
                    socials: 1,
                    images: 1,
                    about: 1,
                    "ticketDetails.isSubTicketing": 1,
                    sectionsInfo: 1,
                },
            },
        ];

        // Execute the aggregation pipeline
        const museumDetails = await Museum.aggregate(pipeline);

        console.log(museumDetails);
        
        // If no museum found, return a 404 error
        if (museumDetails.length === 0) {
            return NextResponse.json(
                createError("Museum not found", 404, false),
                { status: 404 }
            );
        }

        // Return a success response with museum details
        return NextResponse.json(
            createResponse("Museum details fetched successfully", 200, true, museumDetails[0]),
            { status: 200 }
        );
    } catch (error: any) {
        // Log and return error to the client
        console.error("Error while fetching museum details:", error);
        return NextResponse.json(
            createError(error.message || "Internal Server Error", 500, false, error.message || "Error fetching the museum details"),
            { status: 500 }
        );
    }
}