"use client";

// ProductPage.tsx
import React, { useState, useEffect } from "react";

import Image from "next/image";

import { Divider } from "@mui/material";

import type { nft } from "@/lib/types/db";

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
    <div>
      <Image
        src={imageUrl}
        alt="IPFS Image"
        layout="responsive"
        width={500}
        height={500}
      />
    </div>
  );
}

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
function ProductIntro({ nfts = [] }: { nfts: nft[] }) {
  const [selectedProduct, setSelectedProduct] = useState<nft | null>(
    nfts[0] || null,
  );
  const [data, setData] = useState<{ trait: string; image: string } | null>(
    null,
  );

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchProductData = async () => {
      if (selectedProduct) {
        console.log(selectedProduct.metadata);
        const result = await fetchData(selectedProduct.metadata);
        if (result) {
          setData(result);
        } else {
          setData(null); // Handle case where fetchData fails
        }
      }
    };
    // Call the async function
    fetchProductData();
  }, [selectedProduct]);
  useEffect(() => {
    setSelectedProduct(nfts[0] || null);
  }, [nfts]);

  const handleSelectProduct = (product: nft) => {
    setSelectedProduct(product);
  };

  return (
    <div className="pb-12">
      <div className="flex flex-row justify-start space-x-8 pb-2">
        {nfts.map((product) => (
          <button
            key={product.displayId}
            onClick={() => handleSelectProduct(product)}
            className={`pl-2 text-3xl ${
              selectedProduct && selectedProduct.displayId === product.displayId
                ? "font-bold text-dark-blue"
                : ""
            } hover:text-light-blue`}
          >
            {product.name}
          </button>
        ))}
      </div>
      <Divider
        variant="middle"
        orientation="horizontal"
        sx={{ borderWidth: 1 }}
      />
      <div>
        {selectedProduct ? (
          <div className="pl-2">
            <p className="break-all p-2 text-xl">
              price : $ {selectedProduct.mintfee}
            </p>
            <p className="break-all p-2 text-xl">trait : {data?.trait}</p>
            {data?.image && <IPFSImage ipfsLink={data?.image} />}
            <p className="break-all p-2 text-xl">
              name : {selectedProduct.name}
            </p>
          </div>
        ) : (
          <p className="p-2 text-xl">No products.</p>
        )}
      </div>
    </div>
  );
}

export default ProductIntro;
