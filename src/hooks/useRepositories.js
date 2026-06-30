import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORIES } from "../graphql/queries";

/**
 * REUSABLE REPOSITORIES DATA HOOK (useRepositories)
 * WHY IT EXISTS: Instead of mixing API call structures, caching declarations, and collection logic
 * directly inside the dashboard UI views, this hook abstracts data orchestration out of components.
 * Any layout needing to view repository metrics simply calls this single file hook.
 * * HOW IT WORKS: It triggers Apollo Client's query runner to establish an active, cached, and
 * up-to-date data stream matching the query schema definition layout.
 */
const useRepositories = (variables) => {
  // APOLLO QUERY HOOK CONFIGURATION
  // WHY 'cache-and-network': This policy delivers the ultimate balance between performance and freshness.
  // 1. First, it instantly returns any data already saved in your local Apollo memory cache (UI renders instantly).
  // 2. In parallel, it fires a background network request to fetch fresh database entries.
  // 3. Once the server responds, it updates the cache and transparently forces a visual UI refresh.
  const { data, loading, refetch, ...result } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: "cache-and-network",
    variables, // Pass-through variables engine to supply orderBy and orderDirection parameters to the query
  });

  return {
    // SAFE STRUCTURAL EXTRACTION
    // WHY: If the network call is actively executing for the very first time, data is undefined.
    // Trying to read data.repositories would cause a crash. This ternary guard safely falls back
    // to returning undefined until fields are fully populated by the network payload.
    repositories: data ? data.repositories : undefined,
    loading,
    refetch, // Exposes a function to manually trigger a fresh network reload on command
    ...result, // Gathers and forwards additional metadata parameters (e.g., error logs) cleanly
  };
};

export default useRepositories;
