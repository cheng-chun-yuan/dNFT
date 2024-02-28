import { NextResponse, type NextRequest } from "next/server";

import { eq, and } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

const postNFTRequestSchema = z.object({
  address: z.string(),
  mintFee: z.number(),
});
type PostNFTRequest = z.infer<typeof postNFTRequestSchema>;
// POST /api/dNFTs/:eventId/address
/// Create NFT
export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  },
) {
  const { eventId } = params;
  const data = await req.json();
  try {
    // parse will throw an error if the data doesn't match the schema
    postNFTRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    if (error instanceof z.ZodError) {
      console.error(error.errors);
    } else {
      console.error(error);
    }
    return NextResponse.json({ error: "Invalid Zod request" }, { status: 400 });
  }
  const { address, mintFee } = data as PostNFTRequest;
  console.log("address", address);
  console.log("mintFee", mintFee);
  const user = await db.query.usersTable.findFirst({
    where: and(
      eq(usersTable.eventId, eventId),
      eq(usersTable.userAddress, address),
    ),
  });
  if (!user) {
    try {
      // create nft
      const [newUser] = await db
        .insert(usersTable)
        .values({
          eventId: eventId,
          amount: mintFee,
          userAddress: address,
        })
        .returning();
      return NextResponse.json({ user: newUser }, { status: 200 });
    } catch (error) {
      console.error("Error creating nft:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  } else {
    const newAmount = user.amount + mintFee;
    try {
      // create nft
      const updatedUser = await db
        .update(usersTable)
        .set({ amount: newAmount })
        .where(eq(usersTable.id, user.id))
        .returning();
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
      console.error("Error creating nft:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }
}
