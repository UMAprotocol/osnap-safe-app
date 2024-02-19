import { type PublicClient, type WalletClient } from "wagmi";
import { providers } from "ethers";
import { createPublicClient, http } from "viem";
import { contractDataList } from ".";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return new providers.StaticJsonRpcProvider(transport.url as string, network);
}
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
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
