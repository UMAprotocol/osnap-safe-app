import * as abis from "./abis";
import filter from "lodash/filter";
import {
  mainnet,
  goerli,
  optimism,
  gnosis,
  polygon,
  arbitrum,
  avalanche,
} from "@wagmi/chains";

// to potentially cut down on event ranges we query, hard code some deploy blocks for contracts
export interface ContractData {
  chainId: number;
  name: string;
  address: string;
  deployBlockNumber?: number;
  subgraph?: string;
  version?: string;
  // anys required by call into external library
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abi?: any[] | readonly any[];
  decimals?: number;
}

export const oSnapIdentifier =
  "0x4153534552545f54525554480000000000000000000000000000000000000000";
// contract addresses pulled from https://github.com/UMAprotocol/protocol/tree/master/packages/core/networks
export const contractDataList: ContractData[] = [
  // Keep in mind, OG addresses are not the module addresses for each individual space, these addresses typically
  // are not used, but are here for reference.
  {
    // mainnet
    chainId: mainnet.id,
    name: "OptimisticGovernor",
    address: "0x28CeBFE94a03DbCA9d17143e9d2Bd1155DC26D5d",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/mainnet-optimistic-governor",
    deployBlockNumber: 16890621,
    abi: abis.OptimisticGovernor,
  },
  {
    //goerli
    chainId: goerli.id,
    name: "OptimisticGovernor",
    address: "0x07a7Be7AA4AaD42696A17e974486cb64A4daC47b",
    deployBlockNumber: 8700589,
    subgraph:
      "https://api.thegraph.com/subgraphs/name/md0x/goerli-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // optimism
    chainId: optimism.id,
    name: "OptimisticGovernor",
    address: "0x357fe84E438B3150d2F68AB9167bdb8f881f3b9A",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/optimism-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // gnosis
    chainId: gnosis.id,
    name: "OptimisticGovernor",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/gnosis-optimistic-governor",
    abi: abis.OptimisticGovernor,
    address: "0x972396Ab668cd11dc1F6321A5ae30c6A8d3759F0",
  },
  {
    // polygon
    chainId: polygon.id,
    name: "OptimisticGovernor",
    address: "0x3Cc4b597E9c3f51288c6Cd0c087DC14c3FfdD966",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/polygon-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // arbitrum
    chainId: arbitrum.id,
    name: "OptimisticGovernor",
    address: "0x30679ca4ea452d3df8a6c255a806e08810321763",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/arbitrum-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // avalanche
    chainId: avalanche.id,
    name: "OptimisticGovernor",
    address: "0xEF8b46765ae805537053C59f826C3aD61924Db45",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/avalanche-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    chainId: mainnet.id,
    name: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  {
    chainId: polygon.id,
    name: "USDC",
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
  },
  {
    chainId: goerli.id,
    name: "USDC",
    address: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    decimals: 6,
  },
  {
    chainId: gnosis.id,
    name: "USDC",
    address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    decimals: 6,
  },
  {
    chainId: optimism.id,
    name: "USDC",
    address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    decimals: 6,
  },
  {
    chainId: arbitrum.id,
    name: "USDC",
    address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    decimals: 6,
  },
  {
    chainId: avalanche.id,
    name: "USDC",
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    decimals: 6,
  },
  {
    chainId: mainnet.id,
    name: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
  },
  {
    chainId: polygon.id,
    name: "WETH",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    decimals: 18,
  },
  {
    chainId: goerli.id,
    name: "WETH",
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    decimals: 18,
  },
  {
    chainId: gnosis.id,
    name: "WETH",
    address: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
    decimals: 18,
  },
  {
    chainId: optimism.id,
    name: "WETH",
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
  },
  {
    chainId: arbitrum.id,
    name: "WETH",
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    decimals: 18,
  },
  {
    chainId: avalanche.id,
    name: "WETH",
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    decimals: 18,
  },
];

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
): string {
  return findContract({ chainId, name }).address;
}
