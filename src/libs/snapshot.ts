import assert from "assert";
import request, { gql } from "graphql-request";
import useSWR from "swr";

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
  url: string,
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

  const response = await request<VotingResponse>(url, query);
  return response;
};

export const useSnapshotDefaultVotingParameters = (spaceUrl: SpaceUrl) => {
  const { data } = useSWR(
    spaceUrl ? [SNAPSHOT_API_BASE_URI, spaceUrl] : null,
    ([url, spaceUrl]) => getSnapshotDefaultVotingParameters(url, spaceUrl),
  );

  if (data) {
    const { period, quorum } = data.space.voting;
    return {
      period: period ? Math.ceil(period / 3600) : 0, // as string later
      quorum: quorum ? Math.round(quorum) : 0,
    };
  }
};
