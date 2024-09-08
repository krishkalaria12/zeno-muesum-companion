import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/index";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";

// Utility to validate ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(request: Request) {
  try {
    // Validate authentication
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify(createError("Unauthorized", 401, false)), {
        status: 401,
      });
    }

    // Validate museumId from URL
    const museumId = request.url.split("dashboard/")[1];
    if (!museumId || !isValidObjectId(museumId)) {
      return new Response(JSON.stringify(createError("Invalid museum ID", 400, false)), {
        status: 400,
      });
    }

    // Connect to the database
    await connectToDatabase();

    // Date calculations for filtering bookings
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Aggregate sales and peak hours
    const peakHourPipeline = (startDate: Date) => [
      {
        $match: {
          museum: new mongoose.Types.ObjectId(museumId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $hour: "$createdAt" },
          totalTickets: { $sum: 1 },
        },
      },
      { $sort: { totalTickets: -1 } as any },
      { $limit: 1 },
    ];

    const [peakHourMonth, peakHourDay] = await Promise.all([
      Booking.aggregate(peakHourPipeline(startOfMonth)),
      Booking.aggregate(peakHourPipeline(startOfDay)),
    ]);

    // Get the latest 10 bookings
    const recentBookings = await Booking.find({
      museum: new mongoose.Types.ObjectId(museumId),
    })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate total sales for the current month
    const totalSalesMonth = await Booking.aggregate([
      {
        $match: {
          museum: new mongoose.Types.ObjectId(museumId),
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalCost" },
        },
      },
    ]);

    const response = {
      peakHourMonth: peakHourMonth[0] || { _id: "N/A", totalTickets: 0 },
      peakHourDay: peakHourDay[0] || { _id: "N/A", totalTickets: 0 },
      recentBookings,
      totalSalesMonth: totalSalesMonth[0]?.totalSales || 0,
    };

    return new Response(
      JSON.stringify(createResponse("Data fetched successfully", 200, true, response)),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return new Response(
      JSON.stringify(createError("Internal Server Error", 500, false, error)),
      { status: 500 }
    );
  }
}