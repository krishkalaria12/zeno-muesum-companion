import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/db";
import { Museum, MuseumOwner } from "@/models/index";
import { Types } from "mongoose";
export async function POST(request: Request) {
  await connectToDatabase();
  
  try {
    const { has, sessionClaims } = auth();
    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;
  
    if (!has || !mongoId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const existingOwner = await MuseumOwner.findById(mongoId);

    if (!existingOwner) {
      return NextResponse.json(
        { error: "Museum owner not found" },
        { status: 404 },
      );
    }

    let museum;
    if (existingOwner.museums && existingOwner.museums.length > 0) {
      const updatedBody = {
        ...body,
        ticketDetails: {
          ...body.ticketDetails,
          sections: body.ticketDetails.sections.map((section: any) => ({
            name: section.name,
            price: section.price,
          })),
        },
        email: body.email, // Ensure the email field is included
      };
      museum = await Museum.findByIdAndUpdate(
        existingOwner.museums[0],
        updatedBody,
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      const newMuseum = new Museum({
        ...body,
        ticketDetails: {
          ...body.ticketDetails,
          sections: body.ticketDetails.sections.map((section: any) => ({
            name: section.name,
            price: section.price,
          })),
        },
        email: body.email, // Ensure the email field is included
        owner: mongoId,
      });
      museum = await newMuseum.save();
      existingOwner.museums = [museum._id as Types.ObjectId];
      await existingOwner.save();
    }

    return NextResponse.json({ data: museum }, { status: 200 });
  } catch (error) {
    console.error("Detailed error in onboarding:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await connectToDatabase();
  
  try {
    const { has, sessionClaims } = auth();
    const mongoId = (sessionClaims?.mongoId as { mongoId: string })?.mongoId;
  
    if (!has || !mongoId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
  
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const museumOwner = await MuseumOwner.findOne({ clerkId: userId }).populate(
      "museum",
    );

    if (!museumOwner || !museumOwner.museums) {
      return NextResponse.json({ museum: null }, { status: 200 });
    }

    return NextResponse.json({ museum: museumOwner.museums }, { status: 200 });
  } catch (error) {
    console.error("Error fetching museum data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
