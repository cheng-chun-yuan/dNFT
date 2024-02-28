import {
  index,
  pgTable,
  serial,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

// Events Table
export const dNFTsTable = pgTable(
  "dNFTs",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    name: varchar("name").notNull().unique(),
    symbol: varchar("symbol").notNull(),
    link: varchar("link").notNull(),
  },
  (table) => ({
    displayIdIndex: index("dNFTs_display_id_index").on(table.displayId),
  }),
);

//nfts Table
export const nftsTable = pgTable(
  "nfts",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    eventId: uuid("event_id").notNull(),
    name: varchar("name").notNull(),
    metadata: varchar("metadata").notNull(),
    mintfee: integer("mint_fee").notNull(),
  },
  (table) => ({
    displayIdIndex: index("nfts_display_id_index").on(table.displayId),
  }),
);

//user table with donate amount
export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    eventId: uuid("event_id").notNull(),
    userAddress: varchar("user_address").notNull(),
    amount: integer("amount").notNull(),
  },
  (table) => ({
    displayIdIndex: index("users_display_id_index").on(table.displayId),
  }),
);
