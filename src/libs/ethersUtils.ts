import { ethers } from "ethers";
import { type PublicClient, type WalletClient } from "wagmi";
import { createPublicClient, http } from "viem";
import { contractDataList } from ".";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new ethers.JsonRpcProvider(transport.url as string, network);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.BrowserProvider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function getPublicClient(chainId: number) {
  const networkConfig = contractDataList.find(
    (chain) => chain.chainId === chainId,
  );

  if (!networkConfig) {
    return;
  }
  return createPublicClient({
    batch: {
      multicall: true,
    },
    chain: networkConfig.network,
    transport: http(),
  });
}
