import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Museum } from "@/models/index";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        createError("Query parameter is required", 400, false),
        { status: 400 }
      );
    }

    // Create the aggregation pipeline for searching museums
    const pipeline: any[] = [
      {
        $search: {
          index: "museums",
          text: {
            query: query,
            path: ["name"] 
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          description: 1,
          image: 1 // Adjust fields as necessary
        }
      }
    ];

    const museums = await Museum.aggregate(pipeline);

    if (museums.length === 0) {
      return NextResponse.json(
        createResponse("No results found", 404, false, []),
        { status: 404 }
      );
    }

    return NextResponse.json(
      createResponse("Museums fetched successfully", 200, true, museums),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      createError("Internal Server Error", 500, false, error),
      { status: 500 }
    );
  }
}