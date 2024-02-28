"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import Divider from "@mui/material/Divider";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from "wagmi";
import { useAccount } from "wagmi";

import type { dNFTDetailDto } from "@/lib/types/db";
import { DNFTABI } from "@/utils/abis/DNFTABI";
import { DNFTFactoryABI } from "@/utils/abis/DNFTFactory";
import { TokenABI } from "@/utils/abis/TokenABI";
import { DNFT_FACTORY_ADDRESS, PSYCOIN_ADDRESS } from "@/utils/addresses";

import NFTDialog from "./_components/NFTDialog";
import ProductIntro from "./_components/ProductIntro";

async function fetchData(metadata: string) {
  try {
    const response = await fetch(metadata);
    if (!response.ok) {
      // Handle response error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const image = json.image; // Adjust this according to the actual structure
    const trait = json.attributes[0].value; // Adjust this according to the actual structure
    return { trait, image };
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}
const convertIpfsUrlToHttpUrl = (ipfsUrl: string): string => {
  const ipfsPrefix = "ipfs://";
  if (!ipfsUrl.startsWith(ipfsPrefix)) {
    console.error("Invalid IPFS URL");
    return "";
  }
  const hash = ipfsUrl.slice(ipfsPrefix.length);
  // Using the Cloudflare IPFS gateway for example
  return `https://cloudflare-ipfs.com/ipfs/${hash}`;
};

interface IPFSImageProps {
  ipfsLink: string;
}

// React component to display an image from an IPFS link

function IPFSImage({ ipfsLink }: IPFSImageProps) {
  const imageUrl = convertIpfsUrlToHttpUrl(ipfsLink);
  return (
    <div className="w-[50%]">
      <Image
        src={imageUrl}
        alt="IPFS Image"
        layout="responsive"
        width={200}
        height={200}
      />
    </div>
  );
}
function MyEventsIdPage() {
  const { eventId } = useParams();
  const { address } = useAccount();
  const [donateAmount, setDonateAmount] = useState(0);
  const [data, setData] = useState<{ trait: string; image: string } | null>(
    null,
  );
  console.log(eventId);

  const [dbEvents, setDbEvents] = useState<dNFTDetailDto | null>(null);
  const refreshData = async () => {
    const response = await fetch(`/api/dNFTs/${eventId}`);
    const data = await response.json();
    console.log(data);
    setDbEvents(data);
  };
  const { data: amount } = useContractRead({
    address: dbEvents?.link as `0x${string}`,
    abi: DNFTABI,
    functionName: "userDepositAmounts",
    args: [address?.toString() || ""],
    watch: true,
  });
  const { data: tokenURI } = useContractRead({
    address: dbEvents?.link as `0x${string}`,
    abi: DNFTABI,
    functionName: "tokenURI",
    args: [0],
    watch: true,
  });
  useEffect(() => {
    const fetchData = async () => {
      //deleiver address to backend
      const response = await fetch(
        `/api/dNFTs/${eventId}?userAddress=${address}`,
      );
      const data = await response.json();
      console.log(data);
      setDbEvents(data);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchProductData = async () => {
      if (tokenURI) {
        console.log(tokenURI?.toString());
        const result = await fetchData(tokenURI?.toString());
        if (result) {
          setData(result);
        } else {
          setData(null); // Handle case where fetchData fails
        }
      }
    };
    // Call the async function
    fetchProductData();
  }, [tokenURI]);
  const { config: approveConfig } = usePrepareContractWrite({
    address: PSYCOIN_ADDRESS as `0x${string}`,
    abi: TokenABI,
    functionName: "approve",
    args: [
      dbEvents ? dbEvents.link : "",
      donateAmount !== 0
        ? donateAmount
        : dbEvents?.nfts[0]
          ? dbEvents.nfts[0].mintfee
          : 0,
    ],
    onSuccess: (data) => {
      console.log("Successdata", data);
    },
  });
  const { writeAsync: approveNFT } = useContractWrite(approveConfig);

  const { config } = usePrepareContractWrite({
    address: DNFT_FACTORY_ADDRESS as `0x${string}`,
    abi: DNFTFactoryABI,
    functionName: "mintDonateNFT",
    args: [dbEvents ? dbEvents.name : ""],
    onSuccess: (data) => {
      console.log("Successdata", data);
    },
  });

  const { writeAsync: mintDonateNFT } = useContractWrite(config);

  const { config: DonateConfig } = usePrepareContractWrite({
    address: DNFT_FACTORY_ADDRESS as `0x${string}`,
    abi: DNFTFactoryABI,
    functionName: "donate",
    args: [dbEvents ? dbEvents.name : "", donateAmount],
    onSuccess: (data) => {
      console.log("Successdata", data);
    },
  });
  const handleApprove = async () => {
    await approveNFT?.();
  };

  const { writeAsync: donate } = useContractWrite(DonateConfig);
  const handleDonate = async () => {
    await donate?.();
    try {
      const response = await fetch(`/api/dNFTs/${eventId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address?.toString() || "",
          mintFee: Number(donateAmount),
        }),
      });
      if (response.ok) {
        console.log("dNFT donated successfully.");
      } else {
        console.error("Failed to donate dNFT:", response);
      }
    } catch (error) {
      console.error("Failed to donate dNFT:", error);
    }
  };
  const handleSubmit = async () => {
    console.log("minting NFT");
    await mintDonateNFT?.();
    // Send the data to the server
    try {
      const response = await fetch(`/api/dNFTs/${eventId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: address?.toString() || "",
          mintFee: dbEvents?.nfts ? dbEvents.nfts[0].mintfee : 0,
        }),
      });
      if (response.ok) {
        console.log("dNFT minted successfully.");
      } else {
        console.error("Failed to mint dNFT:", response);
      }
    } catch (error) {
      console.error("Failed to mint dNFT:", error);
    }
  };
  if (!dbEvents) {
    return <div>loading...</div>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-[50%] flex-col justify-start pb-8 pl-8 pr-8">
        <p className="flex justify-start p-2 text-4xl font-bold">Information</p>
        <Divider
          variant="middle"
          orientation="horizontal"
          sx={{ borderWidth: 1 }}
        />
      </div>
      <div className="flex flex-row justify-center">
        <div className="pr-24">
          <Image
            src="/events.jpeg"
            alt="event"
            width={400}
            height={400}
            className="p-5 "
          />
        </div>
        <div>
          <div className="flex flex-col p-2">
            <p className="pt-2 text-lg">Name: {dbEvents.name}</p>
          </div>
          <p className="p-2 text-lg">Symbol: {dbEvents.symbol}</p>
          <NFTDialog onRefresh={refreshData} dNFTname={dbEvents.name} />
        </div>
      </div>
      <div className="flex w-[50%] flex-col justify-start p-8">
        <p className="flex justify-start p-2 text-4xl font-bold">
          Current Level
        </p>
        <Divider
          variant="middle"
          orientation="horizontal"
          sx={{ borderWidth: 1 }}
        />
        <button
          className="h-15 m-4 flex w-64 items-center justify-center rounded-2xl bg-dark-blue p-4 text-xl font-bold text-white"
          onClick={handleApprove}
          disabled={!approveNFT}
        >
          Approve
        </button>
        {!dbEvents.user ? (
          <button
            className="h-15 m-4 flex w-64 items-center justify-center rounded-2xl bg-dark-blue p-4 text-xl font-bold text-white"
            onClick={handleSubmit}
            disabled={!mintDonateNFT}
          >
            Mint NFT
          </button>
        ) : (
          <form onSubmit={handleDonate}>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Donate Amount"
                className="border-gray-300 h-10 w-40 rounded-lg border-2 p-2"
                // Assuming you have a state variable to hold the input value
                value={donateAmount}
                onChange={(e) => setDonateAmount(Number(e.target.value))}
                min="1" // Set minimum donation amount if needed
              />
              <button
                type="submit"
                className="h-15 m-4 flex items-center justify-center rounded-2xl bg-dark-blue p-4 text-xl font-bold text-white"
                disabled={!donate}
              >
                Donate
              </button>
            </div>
          </form>
        )}
        <>Current Donation: {amount ? amount?.toString() : "No donation"}</><br/>
        <>TokenURI: {tokenURI ? tokenURI : "No tokenURI"}</>
        <p className="break-all p-2 text-xl">trait : {data?.trait}</p>
        {data?.image && <IPFSImage ipfsLink={data?.image} />}
      </div>
      <div className="justify-cent flex w-[50%] flex-col p-8">
        <ProductIntro nfts={dbEvents.nfts} />
      </div>
    </main>
  );
}

export default MyEventsIdPage;
