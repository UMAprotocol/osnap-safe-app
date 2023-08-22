export const challengePeriods = [
  {
    text: "2 hours",
    seconds: "7200",
  },
  {
    text: "8 hours",
    seconds: "28800",
  },
  {
    text: "24 hours",
    seconds: "86400",
  },
  {
    text: "48 hours",
    seconds: "172800",
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
