import { ChallengePeriod } from "@/constants/challengePeriods";
import { Currency } from "@/constants/currencies";

export type OgDeployerConfig = {
  spaceUrl: string | undefined; // full snapshot space url
  collateralCurrency: Currency; // must add more tokens to support more collaterals
  bondAmount: string; // bond in decimals like 3500.99 usdc
  challengePeriod: ChallengePeriod; // challenge period in seconds with text description
  quorum: string; // voting quorum
};
