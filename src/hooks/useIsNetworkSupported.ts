import { isNetworkSupported } from "@/libs/contracts";
import { useNetwork } from "wagmi";

export function useIsNetworkSupported() {
  const { chain } = useNetwork();

  if (chain?.id) {
    return isNetworkSupported(chain.id);
  }
}
