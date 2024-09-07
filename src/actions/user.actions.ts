import { MuseumOwner } from "@/models/index";
import { connectToDatabase } from "@/lib/db";

// Create a new user in MongoDB
// Update createUser function to ensure museumEmail and phoneNumber are provided
export async function createUser(userData: {
    clerkId: string;
    email: string;
    fullName: string;
    avatar: string;
}) {
    try {
        await connectToDatabase();

        // Check if the user already exists
        const existingUser = await MuseumOwner.findOne({ clerkId: userData.clerkId });
        if (existingUser) {
            throw new Error("User already exists in MongoDB.");
        }

        // Assign default values or provide proper data for required fields
        const museumEmail = userData.email; // Or a placeholder like `${userData.email}@museum.com`
        const phoneNumber = "000-000-0000"; // Placeholder for now

        // Create a new user in the MuseumOwner model
        const newUser = new MuseumOwner({
            clerkId: userData.clerkId,
            personalEmail: userData.email,
            museumEmail: museumEmail,
            name: userData.fullName,
            avatar: userData.avatar,
            phoneNumber: phoneNumber,
            museums: [], // This can be filled later during onboarding
        });

        await newUser.save();

        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Error creating user in MongoDB");
    }
}

// Update user in MongoDB
export async function updateUser(
    clerkId: string,
    userData: {
        email: string;
        name: string;
        avatar: string;
    }
) {
    try {
        await connectToDatabase();

        // Find the user by clerkId and update their info
        const updatedUser = await MuseumOwner.findOneAndUpdate(
        { clerkId },
        {
            personalEmail: userData.email,
            name: userData.name,
            avatar: userData.avatar,
        },
        { new: true }
        );

        if (!updatedUser) {
        throw new Error("User not found in MongoDB.");
        }

        return updatedUser;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Error updating user in MongoDB");
    }
}
