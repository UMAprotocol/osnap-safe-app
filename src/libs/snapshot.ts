import assert from "assert";
import request, { gql } from "graphql-request";

// TODO: Ask @daywiss if there's only one snapshot api? if not do we switch based on chain/env somehow?
const SNAPSHOT_API_BASE_URI = "https://hub.snapshot.org/graphql";

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
  // get full space name from url
  const spaceName = spaceUrl?.split("/").at(-1);
  assert(spaceName?.length, "Empty space name not allowed");
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

  const response = await request<VotingResponse>(SNAPSHOT_API_BASE_URI, query);
  const { period, quorum } = response.space.voting;
  return {
    period: period ? Math.ceil(period / 3600) : 0, // as string later
    quorum: quorum ? Math.round(quorum) : 0,
  };
};
