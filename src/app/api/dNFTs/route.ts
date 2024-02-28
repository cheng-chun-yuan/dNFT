import { NextResponse, type NextRequest } from "next/server";

import { z } from "zod";

import { db } from "@/db";
import { dNFTsTable } from "@/db/schema";

const postEventRequestSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  link: z.string(),
});
// you can use z.infer to get the typescript type from a zod schema
type PostEventRequest = z.infer<typeof postEventRequestSchema>;

// POST /api/dNFTs
/// Create Event
export async function POST(req: NextRequest) {
  console.log("POST /api/dNFTs");
  const data = await req.json();
  try {
    // parse will throw an error if the data doesn't match the schema
    postEventRequestSchema.parse(data);
  } catch (error) {
    // in case of an error, we return a 400 response
    if (error instanceof z.ZodError) {
      console.error(error.errors);
    } else {
      console.error(error);
    }
    return NextResponse.json({ error: "Invalid Zod request" }, { status: 400 });
  }
  const { name, symbol, link } = data as PostEventRequest;
  try {
    // create event
    const [newEventId] = await db
      .insert(dNFTsTable)
      .values({
        name,
        symbol,
        link,
      })
      .returning();

    return NextResponse.json({ event: newEventId }, { status: 200 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET /api/dNFTs
/// Get All dNFTs
export async function GET() {
  console.log("GET /api/dNFTs");
  try {
    const dbdNFTs = await db.query.dNFTsTable.findMany();

    const dNFTsWithTransactionCount = await Promise.all(
      dbdNFTs.map(async (dbEvent) => {
        return {
          displayId: dbEvent.displayId,
          name: dbEvent.name,
          symbol: dbEvent.symbol,
          link: dbEvent.link,
        };
      }),
    );

    return NextResponse.json(dNFTsWithTransactionCount, { status: 200 });
  } catch (error) {
    console.error("Error getting dNFTs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
