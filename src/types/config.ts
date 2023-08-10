import { ChallengePeriod } from "@/constants/challengePeriods";
import { Currency } from "@/constants/currencies";

export type OgDeployerConfig = {
  snapshotSpaceName: string | undefined; // name of snapshot space
  snapshotSpaceUrl: string | undefined; // full snapshot space url
  osnapActivationStatus: OsnapActivationStatus; // active or inactive
  collateralCurrency: Currency; // must add more tokens to support more collaterals
  bondAmount: string; // bond in decimals like 3500.99 usdc
  challengePeriod: ChallengePeriod; // challenge period in seconds with text description
  quorum: string; // voting quorum
  errors: string[]; // errors from validation
};

export type OsnapActivationStatus = "active" | "inactive";
