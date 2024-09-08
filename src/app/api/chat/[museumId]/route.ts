import {  } from "@/models/index";
import { Museum, Booking, Chat } from "@/models/index";
import { currentUser } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import { z } from "zod";
import { streamText, tool } from "ai";
import { openai } from '@ai-sdk/openai';
import { storeMessages } from "@/actions/chat.actions";

// Chatbot logic for answering issues and booking tickets
export async function POST(req: Request) {
  const { messages } = await req.json();
  const user = await currentUser();
  const system = `
  You are a museum chatbot. You assist users by answering questions and booking tickets.`;

  const coreMessages = convertToCoreMessages(messages);

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    system,
    messages: coreMessages,
    tools: {
      book_ticket: tool({
        description: "Book a ticket for a museum",
        parameters: z.object({
          museumId: z.string(),
          attendees: z.array(
            z.object({
              name: z.string(),
              ageGroup: z.enum(["child", "adult", "senior"]),
            })
          ),
        }),
        execute: async ({ museumId, attendees }) => {
          const museum = await Museum.findById(museumId);
          if (!museum) {
            return { message: "Museum not found." };
          }
        
          const totalCost = attendees.length * 20; // Sample ticket price calculation
          const booking = await Booking.create({
            museum: museum._id,
            user: user?.id || null,
            attendees,
            totalCost,
            qrCode: "",
            validity: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week validity
            status: "booked",
            paymentStatus: "completed",
          });
        
          // Generate QR code
          const qrCodeUrl = await QRCode.toDataURL(`Booking ID: ${booking._id}`);
          booking.qrCode = qrCodeUrl;
          await booking.save();
        
          // Generate PDF
          const pdfBuffer = await generateTicketPDF(booking, qrCodeUrl);
        
          return {
            message: `Your ticket has been booked for ${museum.name}.`,
            pdfBuffer,
            museumId, // Include the museumId here in the return object
          };
        },
        
      }),
    },
    onFinish: async ({ text, toolResults }) => {
      // Check if toolResults contain the required fields
      const toolResult = toolResults?.[0];
      if (toolResult?.toolName === "book_ticket" && toolResult?.result) {
        const { museumId } = toolResult.result;
        if (user?.id && museumId) {
          try {
            await storeMessages(user.id, museumId, [
              ...messages,
              { role: "assistant", content: text },
            ]);
          } catch (error) {
            console.error("Failed to store messages:", error);
          }
        }
      }
    },      });

  return result.toAIStreamResponse();
}

// PDF generation function
async function generateTicketPDF(booking: any, qrCodeUrl: any) {
  const doc = new PDFDocument();
  const buffers: any[] = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(18).text("Museum Ticket", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Museum: ${booking.museum.name}`);
  doc.text(`Attendees: ${booking.attendees.map((a: { name: any; }) => a.name).join(", ")}`);
  doc.text(`Total Cost: $${booking.totalCost}`);
  doc.text(`Validity: ${booking.validity.toDateString()}`);
  doc.image(qrCodeUrl, { fit: [100, 100], align: "center" });

  doc.end();
  
  return Buffer.concat(buffers);
}

function convertToCoreMessages(messages: any): any {
  try {
    return convertToCoreMessages(messages);
  } catch (error) {
    console.error("Error in convertToCoreMessages:", error);
    return [];
  }
}
