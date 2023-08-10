import { ChallengePeriod } from "@/constants/challengePeriods";
import { Currency } from "@/constants/currencies";

export type Config = {
  snapshotSpaceUrl: string | undefined; // full snapshot space url
  collateralCurrency: Currency | undefined; // must add more tokens to support more collaterals
  bondAmount: string | undefined; // bond in decimals like 3500.99 usdc
  challengePeriod: ChallengePeriod | undefined; // challenge period in seconds with text description
  quorum: string | undefined; // voting quorum
};

export type Status = "active" | "inactive";
