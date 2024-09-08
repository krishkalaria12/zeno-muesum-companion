import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Booking, IBooking } from "@/models/index";
import { Museum } from "@/models/index";
import { createError } from "@/utils/ApiError";
import { createResponse } from "@/utils/ApiResponse";
import { auth } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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

// Generate a QR code
async function generateQRCode(ticketId: string) {
  const ticketUrl = `https://zeno-muesum-companion.vercel.app/ticket/verify/${ticketId}`;
  return await QRCode.toDataURL(ticketUrl);
}

// Generate the PDF
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

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  try {
    const { has, sessionClaims } = auth();
    const userId = sessionClaims?.mongoId;

    if (!has || !userId) {
      throw createError("Unauthorized", 401, false);
    }

    const { museumId, attendees, sections } = req.body;

    if (!museumId || !mongoose.isValidObjectId(museumId)) {
      throw createError("Invalid Museum ID", 400, false);
    }

    const museum = await checkMuseumExists(museumId);

    let totalCost = 0;
    sections.forEach((section: any) => {
      totalCost += section.quantity * section.costPerTicket;
    });

    const booking: IBooking = await Booking.create({
      museum: museumId,
      user: userId,
      attendees,
      sections,
      totalCost,
      qrCode: "",
      validity: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "booked",
      paymentStatus: "completed",
    });

    const qrCode = await generateQRCode(booking._id.toString());
    booking.qrCode = qrCode;
    await booking.save();

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

    const pdfDownloadLink = `https://zeno-muesum-companion.vercel.app/public/ticket-${booking._id.toString()}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename=ticket-${booking._id.toString()}.pdf`);

    return res.status(200).json(
      createResponse("Ticket booked successfully", 200, true, {
        bookingId: booking._id.toString(),
        pdfUrl: pdfDownloadLink,
      })
    );
  } catch (error: any) {
    return res.status(500).json(createError("Internal Server Error", 500, false, error?.message));
  }
}