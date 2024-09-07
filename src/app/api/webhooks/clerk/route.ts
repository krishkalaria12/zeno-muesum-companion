import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, updateUser } from "@/actions/user.actions";
import { env } from "@/env";
import { Types } from "mongoose";

// Webhook handler for Clerk events
export async function POST(req: Request) {
  // Fetch webhook secret from environment variables
  const WEBHOOK_SECRET = env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Webhook secret is not set.");
    throw new Error("Missing WEBHOOK_SECRET in environment variables");
  }

  // Get Svix headers
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If any of the required Svix headers are missing, return an error
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers.");
    return new Response("Missing Svix headers", { status: 400 });
  }

  // Parse the request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  // Extract ID and event type
  const { id } = evt.data;
  const eventType = evt.type;

  try {
    // Handle user creation
    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name, username } =
        evt.data;

        if (!email_addresses[0]) {
          throw new Error("No Email address found!")
        }

      const userData = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        fullName: `${first_name} ${last_name}`,
        avatar: image_url,
      };

      const newUser = await createUser(userData);

      if (newUser && newUser._id instanceof Types.ObjectId) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            mongoId: newUser._id.toString(),
          },
        });
      }

      return NextResponse.json({ message: "New user created", user: newUser });
    }

    // Handle user updates
    if (eventType === "user.updated") {
      const { id, email_addresses, image_url, first_name, last_name, username } =
        evt.data;

        if (!email_addresses[0]) {
          throw new Error("No Email address found!")
        }

      const userData = {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        avatar: image_url,
      };

      const updatedUser = await updateUser(id, userData);

      return NextResponse.json({ message: "User updated", user: updatedUser });
    }

    // Log unhandled events
    console.log(`Unhandled webhook event: ${eventType}`);
    return new Response("", { status: 200 });
  } catch (error) {
    console.error(`Error processing event ${eventType}:`, error);
    return new Response(`Error processing event ${eventType}`, { status: 500 });
  }
}