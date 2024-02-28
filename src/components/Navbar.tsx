"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import DNFTDialog from "../components/DNFTDialog";
import { AppBar } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  const [isScrolling] = useState(false);

  const navBarStyle = "text-2xl p-4 text-dark-blue hover:border-b-4 font-bold";

  // Render Navbar
  return (
    <AppBar
      position="static"
      className={`text-gray-900 bg-white px-4 py-4 shadow-lg lg:px-12`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Image src="/logo.png" alt="dNFT Logo" width={300} height={200} />
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            isScrolling ? "text-gray-900" : "text-black"
          }`}
        >
          <Link href="/dNFTs" className={navBarStyle}>
            All dNFTs
          </Link>
          <DNFTDialog />
        </ul>
        <div className="flex flex-row space-x-8">
          <ConnectButton />
        </div>
      </div>
    </AppBar>
  );
}

export default Navbar;
