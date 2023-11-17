export const challengePeriods = [
  // first one is the default that will show up in dropdown
  {
    text: "5 Days",
    seconds: "432000",
  },
  {
    text: "72 hours",
    seconds: "259200",
  },
  {
    text: "48 hours",
    seconds: "172800",
  },
  {
    text: "24 hours",
    seconds: "86400",
  },
  {
    text: "8 hours",
    seconds: "28800",
  },
] as const;

export type ChallengePeriods = typeof challengePeriods;
export type ChallengePeriod = ChallengePeriods[number];
export type ChallengePeriodText = ChallengePeriod["text"];
export type ChallengePeriodSeconds = ChallengePeriod["seconds"];

export function findChallengePeriod(
  seconds: string,
): ChallengePeriod | undefined {
  return challengePeriods.find((x) => x.seconds === seconds);
}
