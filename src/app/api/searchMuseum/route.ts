import { connectToDatabase } from "@/lib/db";  // Ensure correct function name is used
import { Museum } from "@/models/index";       // Correct import syntax
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { NextApiRequest, NextApiResponse } from "next";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json(createError("Method Not Allowed", 405, false));
  }

  await connectToDatabase();

  try {
    const query = req.query.query as string;

    // Create the aggregation pipeline for searching museums
    const pipeline: any[] = [];

    pipeline.push({
      $search: {
        index: "museums",
        text: {
          query: query,
          path: ["name"] // Searching by museum names
        }
      }
    });

    pipeline.push({
      $project: {
        _id: 1,
        name: 1,
        location: 1,
        description: 1,
        image: 1 // Adjust fields as necessary
      }
    });

    const museums = await Museum.aggregate(pipeline);

    if (museums.length === 0) {
      return res.status(404).json(createResponse("No results found", 404, false, []));
    }

    return res.status(200).json(createResponse("Museums fetched successfully", 200, true, museums));
  } catch (error) {
    console.error(error);
    return res.status(500).json(createError("Internal Server Error", 500, false, error));
  }
}
