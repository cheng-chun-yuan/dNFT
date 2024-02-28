"use client";

import { useEffect, useState } from "react";

import type { getdNFTDto } from "@/lib/types/db";

import EventCard from "./_components/EventCard";

function EventsPage() {
  const [dbEvents, setDbEvents] = useState<getdNFTDto[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/dNFTs");
      const data = await response.json();
      console.log(data);
      setDbEvents(data);
      const pinataResponse = await fetch("/api/pinata");
      const pinataData = await pinataResponse.json();
      console.log(pinataData);
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center pl-32 pr-32">
      <div className="w-[100%]">
        <p className="flex justify-start p-2 text-4xl font-bold">dNFTs</p>
        <div className="p-4"></div>
        <div className="flex flex-row justify-center">
          {dbEvents &&
            dbEvents.map((e) => {
              return (
                <div
                  key={e.name}
                  className="w-1/4 min-w-[150px] max-w-[300px] flex-none"
                >
                  <EventCard
                    displayId={e.displayId}
                    name={e.name}
                    symbol={e.symbol}
                    link={e.link}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}

export default EventsPage;
