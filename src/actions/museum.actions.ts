import axios from "axios";
import { ISection } from "@/models/index";
import { IBooking, IAttendee } from "@/models/index";
import { MuseumDetails } from "@/types/museum";

export async function fetchMuseumDetails(museumId: string): Promise<MuseumDetails> {
  try {
    console.log(museumId);
    
    const response = await axios.get(`/api/museums/${museumId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching museum details:", error);
    throw new Error("Failed to fetch museum details");
  }
}

// Function to book ticket
export async function bookTicket({
  museumId,
  attendees,
  selectedSections,
}: {
  museumId: string;
  attendees: IAttendee[];
  selectedSections: { sectionId: string; quantity: number }[];
}) {
  const bookingData = {
    museumId,
    attendees,
    sections: selectedSections.map(selectedSection => ({
      sectionId: selectedSection.sectionId,
      quantity: selectedSection.quantity,
    })),
  };

  // Call the booking API
  const response = await axios.post(`/api/tickets/book-ticket`, bookingData);
  return response.data;
}

export const downloadTicketPDF = async (ticketId: string) => {
  try {
    const response = await axios.get(`/api/tickets/download/${ticketId}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ticket.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Error downloading ticket PDF:", error);
    throw new Error("Failed to download the PDF");
  }
};
