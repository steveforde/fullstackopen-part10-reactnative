import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORY } from "../graphql/queries";

/**
 * REUSABLE SINGLE REPOSITORY DATA HOOK (useRepository)
 * WHY IT EXISTS: To decouple single-repository data management from the presentational view tier.
 * It handles the asynchronous data fetching state, error handling, caching policies, and cursor-based
 * pagination tracking completely independently of your UI display component layers.
 *
 * @param {Object} variables - Configuration object containing parameters like id, first, and after.
 */
const useRepository = (variables) => {
  // APOLLO DYNAMIC VARIABLE INJECTION WITH NETWORK CACHE POLICIES
  // WHY fetchPolicy: "cache-and-network": Instantly returns cached review items so the screen
  // loads instantly, while concurrently firing an out-of-band network request to fetch fresh data.
  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_REPOSITORY,
    {
      fetchPolicy: "cache-and-network",
      variables, // Pass down the complete tracking arguments object (id, first, etc.)
    },
  );
  console.log("Hook Data:", data?.repository?.reviews?.pageInfo);
  // ==========================================
  // CURSOR-BASED INFINITE SCROLLING HANDLER
  // ==========================================
  const handleFetchMore = () => {
    const canFetchMore =
      !loading && data?.repository?.reviews?.pageInfo?.hasNextPage;

    // Add these lines to see exactly what the hook is doing:
    console.log("Triggered handleFetchMore");
    console.log("Can fetch more?", canFetchMore);
    console.log("End Cursor:", data?.repository?.reviews?.pageInfo?.endCursor);

    if (!canFetchMore) return;

    fetchMore({
      variables: {
        after: data.repository.reviews.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return {
    repository: data?.repository,
    fetchMore: handleFetchMore, // Expose the pagination function to the view tier
    loading,
    error,
    refetch,
  };
};

export default useRepository;
