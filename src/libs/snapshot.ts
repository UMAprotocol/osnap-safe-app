import assert from "assert";
import request, { gql } from "graphql-request";

const deriveSnapshotApiFromSpaceUrl = (spaceUrl: string) => {
  if (new URL(spaceUrl).hostname.includes("demo")) {
    return "https://testnet.hub.snapshot.org/graphql";
  }
  return "https://hub.snapshot.org/graphql";
};

type VotingResponse = {
  space: {
    voting: {
      period: number | null; // Int => seconds
      quorum: number | null; // Float
      delay: number | null; // Int => seconds
    };
  };
};

type SpaceUrl = string | undefined;

export const getSnapshotDefaultVotingParameters = async (
  spaceUrl: SpaceUrl,
) => {
  assert(spaceUrl, "No spaceUrl");
  // get full space name from url
  const spaceName = spaceUrl.split("/").at(-1);
  assert(spaceName?.length, "Empty space name not allowed");
  const API_URI = deriveSnapshotApiFromSpaceUrl(spaceUrl);
  const decodedString = decodeURIComponent(spaceName);
  const query = gql`
    query defaultParameters {
        space (id: "${decodedString}") {
            voting {
            period
            quorum
            }
        }
    }`;

  const response = await request<VotingResponse>(API_URI, query);
  const { period, quorum } = response.space.voting;
  return {
    period: period ? Math.ceil(period / 3600) : 0, // as string later
    quorum: quorum ? Math.ceil(quorum) : 0,
  };
};
