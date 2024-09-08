import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";  
import { Museum } from "@/models/index";   
import { auth } from "@clerk/nextjs/server";     
import mongoose from "mongoose";
import { createError } from "@/utils/ApiError";    
import { createResponse } from "@/utils/ApiResponse"; 

// Helper function to validate the Museum ID (ObjectId)
function validateMuseumId(id: any): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

export async function POST(req: NextApiRequest, res: NextApiResponse, request: Request) {
  await connectToDatabase();  // Ensure the database connection is established

  try {
    // Authentication check using Clerk
    const { has } = auth();

    // If user is not authenticated
    if (!has) {
      throw createError("Unauthorized", 401, false);
    }

    const museumId = request.url.split("museums/")[1];

    // Validate the museum ID
    if (!museumId || !validateMuseumId(museumId)) {
      throw createError("Invalid Museum ID", 400, false);
    }

    // MongoDB Aggregation Pipeline to fetch museum details
    const pipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(museumId) },  // Match the museum by ID
      },
      {
        $lookup: {
          from: "sections",  // Assuming sections are stored in a separate collection
          localField: "ticketDetails.sections",
          foreignField: "_id",
          as: "sectionsInfo",  // Populate the sections data
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          address: 1,
          phoneNumber: 1,
          timings: 1,  // Keep timings as stored (e.g., "8am to 10pm except Friday")
          googleMapsLink: 1,
          email: 1,
          socials: 1,
          images: 1,
          about: 1,
          "ticketDetails.isSubTicketing": 1,
          sectionsInfo: 1,  // Return sections data
        },
      },
    ];

    // Execute the aggregation pipeline
    const museumDetails = await Museum.aggregate(pipeline);

    // If no museum found, return a 404 error
    if (museumDetails.length === 0) {
      throw createError("Museum not found", 404, false);
    }

    // Return a success response with museum details
    return res.status(200).json(
      createResponse("Museum details fetched successfully", 200, true, museumDetails[0])
    );
  } catch (error: any) {
    // Log and return error to the client
    console.error("Error while fetching museum details:", error);
    return res
      .status(500)
      .json(createError(error.message ? error?.message : "Internal Server Error", 500, false, error.message ? error?.message : "Error fetching the museum details"));
  }
}
