import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Booking, IBooking } from "@/models/index"; // Ensure IBooking is imported for type definition
import { Museum } from "@/models/index";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import QRCode from "qrcode";  // For generating QR codes
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";  // For generating PDF
import fs from "fs";
import path from "path";

// Check if museum exists
async function checkMuseumExists(museumId: string) {
  const museum = await Museum.findById(museumId);
  if (!museum) {
    throw createError("Museum not found", 404, false);
  }
  return museum;
}

// Generate a QR code from the booking information
async function generateQRCode(ticketId: string) {
  const ticketUrl = `https://zeno-muesum-companion.vercel.app/ticket/verify/${ticketId}`;
  const qrCode = await QRCode.toDataURL(ticketUrl);
  return qrCode;
}

// Create a minimalist PDF containing ticket details and the QR code
async function generateTicketPDF(ticketDetails: any, qrCode: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { museumName, user, sections, totalCost, ticketId } = ticketDetails;

  page.drawText(`🎟️ Museum Ticket - ${museumName}`, {
    x: 50,
    y: 350,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Ticket ID: ${ticketId}`, { x: 50, y: 320, size: 12, font });
  page.drawText(`Name: ${user.name}`, { x: 50, y: 300, size: 12, font });
  page.drawText(`Total Cost: $${totalCost}`, { x: 50, y: 280, size: 12, font });

  // Embed the QR code as an image in the PDF
  const qrImage = await pdfDoc.embedPng(qrCode);
  page.drawImage(qrImage, {
    x: 400,
    y: 250,
    width: 150,
    height: 150,
  });

  const pdfBytes = await pdfDoc.save();
  const pdfPath = path.join(process.cwd(), "public", `ticket-${ticketId}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);
  return pdfPath;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();  // Connect to MongoDB

  try {
    const { has, sessionClaims } = auth();
    const userId = sessionClaims?.mongoId;

    // Check if user is authenticated
    if (!has || !userId) {
      throw createError("Unauthorized", 401, false);
    }

    // Parse and validate request data
    const { museumId, attendees, sections } = req.body;

    if (!museumId || !mongoose.isValidObjectId(museumId)) {
      throw createError("Invalid Museum ID", 400, false);
    }

    // Check if the museum exists
    const museum = await checkMuseumExists(museumId);

    // Calculate total cost
    let totalCost = 0;
    sections.forEach((section: any) => {
      totalCost += section.quantity * section.costPerTicket;
    });

    // Create new booking
    const booking: IBooking = await Booking.create({
      museum: museumId,
      user: userId,
      attendees,
      sections,
      totalCost,
      qrCode: "",  // Placeholder, QR code will be generated
      validity: new Date(Date.now() + 24 * 60 * 60 * 1000),  // 24-hour validity
      status: "booked",
      paymentStatus: "completed",  // Assumed payment success for this flow
    });

    // Generate the QR code
    const qrCode = await generateQRCode(booking._id.toString());

    // Save QR code to booking and generate the ticket PDF
    booking.qrCode = qrCode;
    await booking.save();

    // Generate PDF with ticket details and the QR code
    const pdfPath = await generateTicketPDF(
      {
        museumName: museum.name,
        user: { name: sessionClaims?.name },
        sections,
        totalCost,
        ticketId: booking._id.toString(),
      },
      qrCode
    );

    // Send the PDF file to be downloaded
    const pdfDownloadLink = `https://zeno-muesum-companion.vercel.app/public/ticket-${booking._id.toString()}.pdf`;

    // Automatically download the generated PDF link
    res.setHeader("Content-Disposition", `attachment; filename=ticket-${booking._id.toString()}.pdf`);

    return res.status(200).json(
      createResponse("Ticket booked successfully", 200, true, {
        bookingId: booking._id.toString(),
        pdfUrl: pdfDownloadLink,
      })
    );
  } catch (error: any) {
    console.error("Error booking ticket:", error);
    return res.status(500).json(createError("Internal Server Error", 500, false, error?.message));
  }
}