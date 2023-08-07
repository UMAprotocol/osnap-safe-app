import * as abis from "./abis";
import filter from "lodash/filter";
// to potentially cut down on event ranges we query, hard code some deploy blocks for contracts
export type ContractData = {
  network: string;
  name: string;
  address?: string;
  deployBlockNumber?: number;
  subgraph?: string;
  version?: string;
  abi: unknown;
};
// contract addresses pulled from https://github.com/UMAprotocol/protocol/tree/master/packages/core/networks
export const contractDataList: ContractData[] = [
  // Keep in mind, OG addresses are not the module addresses for each individual space, these addresses typically
  // are not used, but are here for reference.
  {
    // mainnet
    network: "1",
    name: "OptimisticGovernor",
    address: "0x28CeBFE94a03DbCA9d17143e9d2Bd1155DC26D5d",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/mainnet-optimistic-governor",
    deployBlockNumber: 16890621,
    abi: abis.OptimisticGovernor,
  },
  {
    //goerli
    network: "5",
    name: "OptimisticGovernor",
    address: "0x07a7Be7AA4AaD42696A17e974486cb64A4daC47b",
    deployBlockNumber: 8700589,
    subgraph:
      "https://api.thegraph.com/subgraphs/name/md0x/goerli-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // optimism
    network: "10",
    name: "OptimisticGovernor",
    address: "0x357fe84E438B3150d2F68AB9167bdb8f881f3b9A",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/optimism-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // gnosis
    network: "100",
    name: "OptimisticGovernor",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/gnosis-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // polygon
    network: "137",
    name: "OptimisticGovernor",
    address: "0x3Cc4b597E9c3f51288c6Cd0c087DC14c3FfdD966",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/polygon-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // arbitrum
    network: "42161",
    name: "OptimisticGovernor",
    address: "0x30679ca4ea452d3df8a6c255a806e08810321763",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/arbitrum-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  {
    // avalanche
    network: "43114",
    name: "OptimisticGovernor",
    address: "0xEF8b46765ae805537053C59f826C3aD61924Db45",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/umaprotocol/avalanche-optimistic-governor",
    abi: abis.OptimisticGovernor,
  },
  // same address on all chains
  {
    network: "1",
    name: "ModuleProxyFactory",
    address: "0x000000000000aDdB49795b0f9bA5BC298cDda236",
    version: "1.2.0",
    abi: abis.ModuleProxyFactory,
  },
  {
    network: "1",
    name: "ModuleProxyFactory",
    address: "0x00000000062c52e29e8029dc2413172f6d619d85",
    version: "1.0.0",
    abi: abis.ModuleProxyFactory,
  },
  {
    network: "1",
    name: "ModuleProxyFactory",
    address: "0x00000000000DC7F163742Eb4aBEf650037b1f588",
    version: "1.1.0",
    abi: abis.ModuleProxyFactory,
  },
];

export const filterContracts = (query: Partial<ContractData>) =>
  filter(contractDataList, query);
