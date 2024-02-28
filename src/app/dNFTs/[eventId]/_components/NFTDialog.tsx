"use client";

import { useState } from "react";
import React from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { DNFTFactoryABI } from "@/utils/abis/DNFTFactory";
import { DNFT_FACTORY_ADDRESS } from "@/utils/addresses";

// Define formData list
interface FormData {
  address: string;
  name: string;
  mintfee: number;
  metadata: string;
}

interface NFTDialogProps {
  onRefresh: () => Promise<void>;
  dNFTname: string;
}

function GetFondDialog({ onRefresh, dNFTname }: NFTDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { address } = useAccount();
  const { eventId } = useParams();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = useState<FormData>({
    address: address?.toString() || "",
    name: "",
    mintfee: 0,
    metadata: "",
  });

  // Define handleChange to update formData
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Update formData with the new value
    const updatedValue = name === "mintfee" ? parseInt(value, 10) : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };
  const { config } = usePrepareContractWrite({
    address: DNFT_FACTORY_ADDRESS as `0x${string}`,
    abi: DNFTFactoryABI,
    functionName: "addNewERC721",
    args: [dNFTname, formData.mintfee, formData.name, formData.metadata],
    onSuccess: (data) => {
      console.log("Successdata", data);
    },
  });

  const { writeAsync: addnewNFT } = useContractWrite(config);

  // // Define handleSubmit to create a new NFT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addnewNFT?.();
    try {
      const response = await fetch(`/api/dNFTs/${eventId}`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData.error);
      } else {
        await onRefresh();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <button
        className="h-15 m-4 flex w-64 items-center justify-center rounded-2xl bg-dark-blue p-4 text-xl font-bold text-white"
        onClick={handleClickOpen}
      >
        Add NFT
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Create Product</DialogTitle>
        <DialogContent className="space-y-2">
          <label
            htmlFor="name"
            className="text-gray-700 text-xm block font-medium"
          >
            NFT Name :
          </label>
          <TextField
            autoFocus
            margin="dense"
            id="NFT Name"
            name="name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <label
            htmlFor="mintfee"
            className="text-gray-700 text-xm block font-medium"
          >
            NFT fee :
          </label>
          <TextField
            autoFocus
            margin="dense"
            id="mintfee"
            name="mintfee"
            type="number"
            variant="standard"
            onChange={handleChange}
            fullWidth
            required
            className="pb-2"
          />
          <div className="flex items-center justify-between">
            <label
              htmlFor="metadata"
              className="text-gray-700 text-xm block font-medium"
            >
              Metadata URI:
            </label>
            <Link href="/pinata" passHref>
              Get Metadata URI here
            </Link>
          </div>
          <TextField
            autoFocus
            margin="dense"
            id="metadata"
            name="metadata"
            type="string"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <form onSubmit={handleSubmit} className="flex justify-center">
            <Button type="submit" onClick={handleClose}>
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default GetFondDialog;
