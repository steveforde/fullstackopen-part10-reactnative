import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORY } from "../graphql/queries";

/**
 * REUSABLE SINGLE REPOSITORY DATA HOOK (useRepository)
 * WHY IT EXISTS: To decouple single-repository data management from the presentational view tier.
 * It handles the asynchronous data fetching state, error handling, and caching policies completely
 * independently of your UI display component layers.
 * * @param {String} id - The unique repository identification string extracted from the routing path parameters.
 */
const useRepository = (id) => {
  // APOLLO DYNAMIC VARIABLE INJECTION WITH NETWORK CACHE POLICIES
  // WHY variables: { id }: The server requires an explicit ID parameter to isolate a single record entry.
  // WHY fetchPolicy: "cache-and-network": By default, Apollo reads straight from local cache memory and stays there.
  // By altering the policy to "cache-and-network", the hook instantly returns cached review items so the screen
  // loads instantly, while concurrently firing an out-of-band network request to fetch freshly submitted review
  // logs from the remote database backend.
  const { data, loading, error, refetch } = useQuery(GET_REPOSITORY, {
    fetchPolicy: "cache-and-network",
    variables: { id },
  });

  return {
    // SAFE DATA OBJECT RESOLUTION
    // Optional chaining (`data?.repository`) safely yields 'undefined' while the network stream finishes
    // resolving, protecting presentational layouts from referencing properties on null layout instances.
    repository: data?.repository,
    loading,
    error,
    refetch, // Explicitly exposed to give presentational components manual refreshing control if needed
  };
};

export default useRepository;
