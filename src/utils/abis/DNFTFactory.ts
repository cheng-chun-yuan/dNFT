export const DNFTFactoryABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "issuer_",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "dNFT_",
        type: "address",
      },
      { indexed: false, internalType: "string", name: "name_", type: "string" },
      {
        indexed: false,
        internalType: "address",
        name: "fundAsset_",
        type: "address",
      },
    ],
    name: "DNFTCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "ERC721name_",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintPrice_",
        type: "uint256",
      },
      { indexed: false, internalType: "string", name: "name_", type: "string" },
      {
        indexed: false,
        internalType: "string",
        name: "metadataURI_",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "ERC721AddNewNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "to_", type: "address" },
      {
        indexed: false,
        internalType: "string",
        name: "ERC721name_",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "ERC721Donated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "to_", type: "address" },
      {
        indexed: false,
        internalType: "string",
        name: "ERC721name_",
        type: "string",
      },
    ],
    name: "ERC721Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "protocolFeeRate_",
        type: "uint256",
      },
    ],
    name: "ProtocolFeeRateSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "to_", type: "address" },
      {
        indexed: false,
        internalType: "address",
        name: "fundAsset_",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "ProtocolWithdrawn",
    type: "event",
  },
  {
    inputs: [
      { internalType: "string", name: "_ERC721name", type: "string" },
      { internalType: "uint256", name: "_mintPrice", type: "uint256" },
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_metadataURI", type: "string" },
    ],
    name: "addNewERC721",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_fundAsset", type: "address" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
    ],
    name: "createDNFT",
    outputs: [{ internalType: "address", name: "dNFT_", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_amounts", type: "uint256" },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_name", type: "string" }],
    name: "mintDonateNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocolFeeRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "protocolFeeRate_", type: "uint256" },
    ],
    name: "setProtocolFeeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "fundAsset_", type: "address" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
