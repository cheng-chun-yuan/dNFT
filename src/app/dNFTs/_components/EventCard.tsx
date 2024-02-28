"use client";

// import React, { useEffect, useState } from "react";
import Link from "next/link";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { type getdNFTDto } from "@/lib/types/db";

// Assuming fetchData function remains the same
// async function fetchData(baseTokenURI: string, index: number) {
//   try {
//     const response = await fetch(
//       `${baseTokenURI}${index + 1}.json`.replace(/\s/g, ""),
//     );
//     if (!response.ok) {
//       // Handle response error
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const json = await response.json();
//     console.log(json);
//     return json;
//   } catch (error) {
//     console.error("Error fetching data: ", error);
//   }
// }
export default function EventCard({
  displayId,
  name,
  symbol,
  link,
}: getdNFTDto) {
  const url = `https://sepolia.etherscan.io/address/${link}`;
  return (
    <Link
      href={{
        pathname: `/dNFTs/${displayId}`,
      }}
    >
      <Paper className="w-[95%] p-5 hover:cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <Typography className="break-all font-bold" variant="h4">
            {name}
          </Typography>
          <p className="pl-6 text-xl font-bold text-dark-blue">{symbol}</p>
          <Link href={url}>
            <div className="text-blue-500 hover:text-blue-700">View Event</div>
          </Link>
        </div>
      </Paper>
    </Link>
  );
}
