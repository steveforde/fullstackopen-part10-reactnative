import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORY } from "../graphql/queries";

/**
 * REUSABLE SINGLE REPOSITORY DATA HOOK (useRepository)
 * WHY IT EXISTS: To decouple your single-repository viewing logic from UI display implementations.
 * Instead of embedding individual item queries directly inside `SingleRepository.jsx`, this hook
 * manages the query subscription parameters independently.
 * * HOW IT WORKS: It fires the `GET_REPOSITORY` query dynamically to fetch detailed statistics
 * and external action URLs for one tracking profile.
 * * @param {String} id - The unique repository node identity string extracted from the routing path.
 */
const useRepository = (id) => {
  // APOLLO DYNAMIC VARIABLE INJECTION
  // WHY variables: { id }: The server needs to know exactly which single profile to look up.
  // We feed our dynamic string token argument into the query options context variable slot.
  const { data, loading, error } = useQuery(GET_REPOSITORY, {
    fetchPolicy: "cache-and-network", // Instantly reads existing cache, then syncs from network smoothly
    variables: { id },
  });

  return {
    // SAFE RECORD EXTRACTION
    // GAURD PATTERN: Safely holds an 'undefined' fallback placeholder block while the async network
    // stream finishes transferring the data payload, protecting the UI from crash calls on load.
    repository: data ? data.repository : undefined,
    loading,
    error, // Explicitly returned to let consuming views handle backend failures gracefully
  };
};

export default useRepository;
