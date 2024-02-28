"use client";

import { useState } from "react";
import React from "react";

import { DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { useAccount } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { DNFTFactoryABI } from "@/utils/abis/DNFTFactory";
import { DNFT_FACTORY_ADDRESS, PSYCOIN_ADDRESS } from "@/utils/addresses";

function DNFTDialog() {
  const [open, setOpen] = React.useState(false);
  const [resultAddress, setResultAddress] = useState("");
  const { address } = useAccount();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [dNFTData, setdNFTData] = useState({
    address: address?.toString() || "",
    name: "",
    symbol: "",
    link: "",
  });

  // Define handleChange to update formData
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Handle all other fields normally
    setdNFTData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const { config } = usePrepareContractWrite({
    address: DNFT_FACTORY_ADDRESS as `0x${string}`,
    abi: DNFTFactoryABI,
    functionName: "createDNFT",
    args: [PSYCOIN_ADDRESS, dNFTData.name, dNFTData.symbol],
    onSuccess: (data) => {
      console.log("Success", data);

      setResultAddress(data.result?.toString() || "");
      console.log(resultAddress);
      setdNFTData((prevData) => ({
        ...prevData,
        link: resultAddress,
      }));
    },
  });

  const { writeAsync: createDNFT } = useContractWrite(config);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createDNFT?.();
    // Send the data to the server
    try {
      const response = await fetch("/api/dNFTs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dNFTData),
      });
      if (response.ok) {
        console.log("dNFT created successfully.");
        handleClose();
      } else {
        console.error("Failed to create dNFT:", response);
      }
    } catch (error) {
      console.error("Failed to create dNFT:", error);
    }
  };

  return (
    <React.Fragment>
      <button
        className="w-30 m-4 flex h-10 items-center justify-center rounded-2xl bg-dark-blue p-4 text-xl font-bold text-white"
        onClick={handleClickOpen}
      >
        New dNFT
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Create dNFT Event</DialogTitle>
        <DialogContent className="space-y-2">
          <InputLabel htmlFor="name">Name:</InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <InputLabel htmlFor="symbol">Symbol:</InputLabel>
          <TextField
            margin="dense"
            id="symbol"
            name="symbol"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          {/* Assuming percentage is handled elsewhere or not directly input by users in this form */}
          <form onSubmit={handleSubmit} className="flex justify-center">
            <Button type="submit">Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default DNFTDialog;
