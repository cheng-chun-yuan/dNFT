"use client";

import { useState, useRef } from "react";

import Image from "next/image";

function PinataPage() {
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [metadataCID, setMetadataCID] = useState("");
  // State hooks for each form field
const [name, setName] = useState("");
const [trait, setTrait] = useState("");
const [traitType, setTraitType] = useState("");
const [description, setDescription] = useState("");
// Assuming `cid` is already defined similarly

// Update the state for each field
const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
const handleTraitChange = (e: React.ChangeEvent<HTMLInputElement>) => setTrait(e.target.value);
const handleTraitTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => setTraitType(e.target.value);
const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);

// Check if all fields are filled to enable the submit button
const isFormFilled = name!=="" && trait!=="" && traitType!=="" && description!=="" && cid!=="";

  const inputFile = useRef(null);

  const uploadFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/pinata", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      console.log(resData);
      setCid(resData.IpfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://ipfs.io/ipfs/${metadataCID}`);
      // Optionally, show feedback to the user that the text was copied.
      alert('Copied to clipboard!');
    } catch (err) {
      // Handle potential errors here
      console.error('Failed to copy:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };
  function metadata(
    cid: string,
    name: string,
    trait: string,
    traitType: string,
    description: string,
  ) {
    return {
      description: description,
      external_url: "",
      image: `ipfs://${cid}`,
      name: name,
      attributes: [
        {
          trait_type: trait,
          value: traitType,
        },
      ],
    };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const metadataObj = metadata(cid, name, trait, traitType, description);

    console.log(metadataObj);
    const blob = new Blob([JSON.stringify(metadataObj)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", blob, "metadata.json");
    const res = await fetch("/api/pinata", {
      method: "POST",
      body: formData,
    });
    const resData = await res.json();
    console.log(resData);
    setMetadataCID(resData.IpfsHash);
  };

  return (
    <main className="m-auto flex w-full flex-col items-center justify-center space-y-4">
      {/* Group each label-input pair for better alignment and spacing */}
      <p className="text-4xl font-bold text-dark-blue mb-4">Get your MetaData URI</p>

      <div className="flex items-center space-x-2">
        <label
          htmlFor="name"
          className="text-gray-700 block text-sm font-medium"
        >
          Name:
        </label>
        <input
          autoFocus
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          type="text"
          required
          className="border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label
          htmlFor="trait"
          className="text-gray-700 block text-sm font-medium"
        >
          Trait:
        </label>
        <input
          id="trait"
          name="trait"
          value={trait}
          onChange={handleTraitChange}
          type="text"
          required
          className="border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label
          htmlFor="traitType"
          className="text-gray-700 block text-sm font-medium"
        >
          Trait Type:
        </label>
        <input
          id="traitType"
          name="traitType"
          value={traitType}
          onChange={handleTraitTypeChange}
          type="text"
          required
          className="border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label
          htmlFor="description"
          className="text-gray-700 block text-sm font-medium"
        >
          Description:
        </label>
        <input
          id="description"
          name="description"
          value={description}
          onChange={handleDescriptionChange}
          type="text"
          required
          className="border-gray-300 focus:border-indigo-300 focus:ring-indigo-200 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="file"
          id="file"
          ref={inputFile}
          className="text-gray-900 file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold"
          onChange={handleChange}
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={uploading}
        className="bg-indigo-600 text-black hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 mt-4 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {cid && (
        <Image
          src={`https://cloudflare-ipfs.com/ipfs/${cid}`}
          alt="Image from IPFS"
          className="mt-4 object-cover"
          width={200}
          height={200}
        />
      )}

      {/* Assuming `handleSubmit` is defined elsewhere in your component */}
      <form onSubmit={handleSubmit} className="flex w-full justify-center">
        <button
          type="submit"
          disabled={!isFormFilled}
          className="bg-indigo-600 text-black hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300 mt-4 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </form>

      {metadataCID && (
        <div className="flex justify-center items-center space-x-2">
          <p className="text-gray-600 text-center text-sm">
            Metadata CID: {metadataCID}
          </p>
          <button onClick={handleCopy} className="text-gray-600 hover:text-gray-800">
            {/* <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 4h4a2 2 0 012 2v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2z" /></svg> */}
            📋
          </button>
        </div>
      )}
    </main>
  );
}

export default PinataPage;
