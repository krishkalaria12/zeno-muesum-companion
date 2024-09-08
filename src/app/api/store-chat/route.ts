import { NextRequest, NextResponse } from "next/server";
import { Chat } from "@/models/index"; // Use your defined Chat model
import { connectToDatabase } from "@/lib/db"; // Ensure database connection
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  await connectToDatabase();

  try {
    const { userId, messages, museumId } = await request.json();

    // Input validation
    if (!userId || !messages || !museumId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Find the chat history for this museum and user
    let chat = await Chat.findOne({
      museumId: new mongoose.Types.ObjectId(museumId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    // If no existing chat, create a new one
    if (!chat) {
      chat = new Chat({
        museumId: new mongoose.Types.ObjectId(museumId),
        userId: new mongoose.Types.ObjectId(userId),
        messages: [],
      });
    }

    // Add new messages to the chat
    chat.messages.push(...messages);

    // Save chat to the database
    await chat.save();

    return NextResponse.json(
      { message: "Messages stored successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}