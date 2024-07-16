import filter from "lodash/filter";
import {
  mainnet,
  goerli,
  optimism,
  gnosis,
  polygon,
  arbitrum,
  avalanche,
  sepolia,
  base,
  Chain,
} from "viem/chains";
import { type Address } from "wagmi";
import { coreDao } from "../app/customChains";

import { graphStudioApiKey } from "./env";

export { Address };

export function isAddress(addr: unknown): addr is Address {
  return typeof addr === "string" && addr.startsWith("0x");
}

// to potentially cut down on event ranges we query, hard code some deploy blocks for contracts
export type ContractData = {
  name: string;
  chainId: number;
  network: Chain;
  address: Address;
  deployBlockNumber?: number;
  subgraph?: string;
  version?: string;
  decimals?: number;
};

export const oSnapIdentifier =
  "0x4153534552545f54525554480000000000000000000000000000000000000000";
// contract addresses pulled from https://github.com/UMAprotocol/protocol/tree/master/packages/core/networks
export const contractDataList: ContractData[] = [
  // Keep in mind, OG addresses are not the module addresses for each individual space, these addresses typically
  // are not used, but are here for reference.
  {
    // mainnet
    chainId: mainnet.id,
    network: mainnet,
    name: "OptimisticGovernor",
    address: "0x28CeBFE94a03DbCA9d17143e9d2Bd1155DC26D5d",
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/DQpwhiRSPQJEuc8y6ZBGsFfNpfwFQ8NjmjLmfv8kBkLu`,
    deployBlockNumber: 16890621,
  },
  {
    //goerli
    chainId: goerli.id,
    network: goerli,
    name: "OptimisticGovernor",
    address: "0x07a7Be7AA4AaD42696A17e974486cb64A4daC47b",
    deployBlockNumber: 8700589,
    subgraph:
      "https://api.thegraph.com/subgraphs/name/md0x/goerli-optimistic-governor",
  },
  {
    // optimism
    chainId: optimism.id,
    network: optimism,
    name: "OptimisticGovernor",
    address: "0x357fe84E438B3150d2F68AB9167bdb8f881f3b9A",
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/Fd5RvSfkajAJ8Mi9sPxFSMVPFf56SDivDQW3ocqTAW5`,
  },
  {
    // gnosis
    chainId: gnosis.id,
    network: gnosis,
    name: "OptimisticGovernor",
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/RrkjZ6wTgLJkcjX68auzrEZHMRYwDx8kR5sFQQy4Phz`,
    address: "0x972396Ab668cd11dc1F6321A5ae30c6A8d3759F0",
  },
  {
    // polygon
    chainId: polygon.id,
    network: polygon,
    name: "OptimisticGovernor",
    address: "0x3Cc4b597E9c3f51288c6Cd0c087DC14c3FfdD966",
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/7L2JM14PnZgxGnRX7xaz54zWS6KVK6ZqVRCxEKJrJTDG`,
  },
  {
    // arbitrum
    chainId: arbitrum.id,
    network: arbitrum,
    name: "OptimisticGovernor",
    address: "0x30679ca4ea452d3df8a6c255a806e08810321763",
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/BfK867bnkQhnx1LspA99ypqiqxbAReQ92aZz66Ubv4tz`,
  },
  {
    // avalanche
    chainId: avalanche.id,
    network: avalanche,
    name: "OptimisticGovernor",
    address: "0xEF8b46765ae805537053C59f826C3aD61924Db45",
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/5F8875fmvtnv8Vv4aeedUcwNWjuxUg54aTHdapFuMJi3`,
  },
  {
    // core
    chainId: coreDao.id,
    network: coreDao,
    name: "OptimisticGovernor",
    address: "0x596Fd6A5A185c67aBD1c845b39f593fBA9C233aa",
    subgraph:
      "https://thegraph.coredao.org/subgraphs/name/umaprotocol/core-optimistic-governor",
  },
  {
    // sepolia
    chainId: sepolia.id,
    network: sepolia,
    name: "OptimisticGovernor",
    address: "0x40153DdFAd90C49dbE3F5c9F96f2a5B25ec67461",
    deployBlockNumber: 5421242,
    subgraph: `https://gateway-arbitrum.network.thegraph.com/api/${graphStudioApiKey}/subgraphs/id/5pwrjCkpcpCd79k9MBS5yVgnsHQiw6afvXUfzqHjdRFw`,
  },
  // optimistic oracle v3
  {
    // mainnet https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/mainnet.json
    chainId: mainnet.id,
    network: mainnet,
    name: "OptimisticOracleV3",
    address: "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE",
    deployBlockNumber: 16636058,
  },
  {
    //goerli https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/goerli.json
    chainId: goerli.id,
    network: goerli,
    name: "OptimisticOracleV3",
    address: "0x9923D42eF695B5dd9911D05Ac944d4cAca3c4EAB",
    deployBlockNumber: 8497481,
  },
  {
    // optimism https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/optimism.json
    chainId: optimism.id,
    network: optimism,
    name: "OptimisticOracleV3",
    address: "0x072819Bb43B50E7A251c64411e7aA362ce82803B",
    deployBlockNumber: 74537234,
  },
  {
    // gnosis https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/gnosis.json
    chainId: gnosis.id,
    network: gnosis,
    name: "OptimisticOracleV3",
    address: "0x22A9AaAC9c3184f68C7B7C95b1300C4B1D2fB95C",
    deployBlockNumber: 27087150,
  },
  {
    // polygon https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/polygon.json
    chainId: polygon.id,
    network: polygon,
    name: "OptimisticOracleV3",
    address: "0x5953f2538F613E05bAED8A5AeFa8e6622467AD3D",
    deployBlockNumber: 39331673,
  },
  {
    // arbitrum https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/arbitrum.json
    chainId: arbitrum.id,
    network: arbitrum,
    name: "OptimisticOracleV3",
    address: "0xa6147867264374F324524E30C02C331cF28aa879",
    deployBlockNumber: 61236565,
  },
  {
    // avalanche https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/avalanche.json
    chainId: avalanche.id,
    network: avalanche,
    name: "OptimisticOracleV3",
    address: "0xa4199d73ae206d49c966cF16c58436851f87d47F",
    deployBlockNumber: 27816737,
  },
  {
    // core https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/core.json
    chainId: coreDao.id,
    network: coreDao,
    name: "OptimisticOracleV3",
    address: "0xD84ACa67d683aF7702705141b3C7E57e4e5e7726",
    deployBlockNumber: 11341063,
  },
  {
    // sepolia https://github.com/UMAprotocol/subgraphs/blob/master/packages/optimistic-oracle-v3/manifest/data/sepolia.json
    chainId: sepolia.id,
    network: sepolia,
    name: "OptimisticOracleV3",
    address: "0xFd9e2642a170aDD10F53Ee14a93FcF2F31924944",
    deployBlockNumber: 5421195,
  },
  {
    chainId: mainnet.id,
    network: mainnet,
    name: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  {
    chainId: polygon.id,
    network: polygon,
    name: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
  },
  {
    chainId: goerli.id,
    network: goerli,
    name: "USDC",
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    decimals: 6,
  },
  {
    chainId: gnosis.id,
    network: gnosis,
    name: "USDC",
    address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    decimals: 6,
  },
  {
    chainId: optimism.id,
    network: optimism,
    name: "USDC",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    decimals: 6,
  },
  {
    chainId: arbitrum.id,
    network: arbitrum,
    name: "USDC",
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    decimals: 6,
  },
  {
    chainId: avalanche.id,
    network: avalanche,
    name: "USDC",
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    decimals: 6,
  },
  {
    chainId: coreDao.id,
    network: coreDao,
    name: "USDC",
    address: "0xa4151B2B3e269645181dCcF2D426cE75fcbDeca9",
    decimals: 6,
  },
  {
    chainId: sepolia.id,
    network: sepolia,
    name: "USDC",
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    decimals: 6,
  },
  {
    chainId: mainnet.id,
    network: mainnet,
    name: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
  },
  {
    chainId: polygon.id,
    network: polygon,
    name: "WETH",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
  },
  {
    chainId: goerli.id,
    network: goerli,
    name: "WETH",
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    decimals: 18,
  },
  {
    chainId: gnosis.id,
    network: gnosis,
    name: "WETH",
    address: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
    decimals: 18,
  },
  {
    chainId: optimism.id,
    network: optimism,
    name: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
  },
  {
    chainId: arbitrum.id,
    network: arbitrum,
    name: "WETH",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
  },
  {
    chainId: avalanche.id,
    network: avalanche,
    name: "WETH",
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    decimals: 18,
  },
  {
    chainId: coreDao.id,
    network: coreDao,
    name: "WETH",
    address: "0xeAB3aC417c4d6dF6b143346a46fEe1B847B50296",
    decimals: 18,
  },
  {
    chainId: sepolia.id,
    network: sepolia,
    name: "WETH",
    address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    decimals: 18,
  },
  // base https://github.com/UMAprotocol/protocol/blob/master/packages/core/networks/8453.json
  {
    chainId: base.id,
    network: base,
    name: "OptimisticGovernor",
    address: "0x80bCA2E1c272239AdFDCdc87779BC8Af6E12e633",
    subgraph:
      "https://api.studio.thegraph.com/query/1057/base-optimistic-governor/version/latest",
  },
  {
    chainId: base.id,
    network: base,
    name: "OptimisticOracleV3",
    address: "0x2aBf1Bd76655de80eDB3086114315Eec75AF500c",
  },
  {
    chainId: base.id,
    network: base,
    name: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  {
    chainId: base.id,
    network: base,
    name: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
  },
];

export function isNetworkSupported(chainId: number): boolean {
  const oracleContracts = filterContracts({
    chainId,
  });

  return oracleContracts.length > 0;
}

// find all that match query
export const filterContracts = (query: Partial<ContractData>): ContractData[] =>
  filter(contractDataList, query);

// find an exact match for a query
export const findContract = (query: Partial<ContractData>): ContractData => {
  const results = filterContracts(query);
  if (results.length === 1) return results[0];
  if (results.length === 0) throw new Error("Unable to find contract data");
  throw new Error("query matched more than one contract data");
};

export function getFinderAddress(chainId: number): string {
  return findContract({ chainId, name: "Finder" }).address;
}
export function getTokenAddress(
  chainId: number,
  name: "WETH" | "USDC",
): Address {
  return findContract({ chainId, name }).address;
}

// https://github.com/gnosis/zodiac-safe-app/blob/0dfeac33b8e95af566c7ff7b1d77017071219599/packages/app/src/services/helpers.ts#L4C1-L4C71
export const AddressOne = "0x0000000000000000000000000000000000000001";
