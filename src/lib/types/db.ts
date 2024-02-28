export type dNFTDto = {
  name: string;
  symbol: string;
  link: string;
};

export type getdNFTDto = {
  displayId: string;
  name: string;
  symbol: string;
  link: string;
};

export type dNFTData = {
  name: string;
  symbol: string;
  metadata: string;
  mintFee: string;
};
export type dNFTDetailDto = {
  name: string;
  symbol: string;
  metadata: string;
  mintFee: string;
  link: string;
  nfts: nft[];
  user: user;
};
export type user = {
  userAddress: string;
  amount: string;
};
export type nft = {
  displayId: string;
  name: string;
  metadata: string;
  mintfee: string;
};
