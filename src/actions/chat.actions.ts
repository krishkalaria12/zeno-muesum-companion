import axios from "axios";

// Utility function to store messages using the API route
export async function storeMessages(userId: string, museumId: string, messages: any[]) {
    try {
        const response = await axios.post("/api/store-messages", {
            userId,
            museumId,
            messages,
        });
        return response.data;
    } catch (error) {
        console.error("Error storing messages:", error);
        throw new Error("Failed to store messages.");
    }
}
