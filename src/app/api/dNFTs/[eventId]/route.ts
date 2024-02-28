import { NextResponse, type NextRequest } from "next/server";

import { eq ,and} from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { dNFTsTable, nftsTable, usersTable } from "@/db/schema";

// GET /api/dNFTs/:eventId
/// Get EventDetail and NFTs
export async function GET(
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
  const url = new URL(req.url);
  const address = url.searchParams.get("userAddress");
  try {
    // Get the Event
    const dbEvent = await db.query.dNFTsTable.findFirst({
      where: eq(dNFTsTable.displayId, eventId),
    });
    if (!dbEvent) {
      return NextResponse.json({ error: "Event Not Found" }, { status: 404 });
    }
    const nfts = await db.query.nftsTable.findMany({
      where: eq(nftsTable.eventId, dbEvent.displayId),
    });
    const user = await db.query.usersTable.findFirst({
      where: and(
        eq(usersTable.userAddress, address || ""),
        eq(usersTable.eventId, dbEvent.displayId),
        ),
    });
    return NextResponse.json(
      {
        id: dbEvent.id,
        displayId: dbEvent.displayId,
        name: dbEvent.name,
        symbol: dbEvent.symbol,
        link: dbEvent.link,
        nfts: nfts,
        user: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

const postNFTRequestSchema = z.object({
  name: z.string(),
  metadata: z.string(),
  mintfee: z.number(),
});
type PostNFTRequest = z.infer<typeof postNFTRequestSchema>;
// POST /api/dNFTs/:eventId
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
  const { name, metadata, mintfee } = data as PostNFTRequest;
  try {
    // create nft
    const [newNFTId] = await db
      .insert(nftsTable)
      .values({
        eventId,
        name,
        metadata,
        mintfee,
      })
      .returning();
    return NextResponse.json({ nft: newNFTId }, { status: 200 });
  } catch (error) {
    console.error("Error creating nft:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
