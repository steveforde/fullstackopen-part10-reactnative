import { FlatList, View, StyleSheet, Pressable } from "react-native";
import { useNavigate } from "react-router-native";
import RepositoryItem from "./RepositoryItem";
import useRepositories from "../../hooks/useRepositories";

// Define visual spacing between list items
const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

// Small presentational component to render a gap between rows in the FlatList
const ItemSeparator = () => <View style={styles.separator} />;

/**
 * 1. PRESENTATIONAL / PURE CONTAINER
 * WHY IT EXISTS: This component handles ONLY UI rendering. By keeping it "pure" and free of
 * data-fetching hooks (useQuery) or routing hooks (useNavigate), we can easily test it in
 * Jest without setting up complex wrappers or mocking native router contexts.
 * * HOW IT WORKS: It maps the GraphQL edge nodes into a clean array and fires a callback prop
 * when an item is clicked, delegating the action up to the parent wrapper.
 */
export const RepositoryListContainer = ({
  repositories,
  onRepositoryPress,
}) => {
  // Extract node data safely from GraphQL edges structure
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        /* Wrap item in Pressable to make the whole row interactive.
          Fires the action hook callback passed from the smart wrapper.
        */
        <Pressable onPress={() => onRepositoryPress(item.id)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

/**
 * 2. SMART CONTAINER / WRAPPER
 * WHY IT EXISTS: This component handles side-effects, real runtime hooks, and state management.
 * This isolates runtime complexities from our presentational layer layout.
 * * HOW IT WORKS: It fetches repository statistics data via our Apollo useRepositories hook,
 * instantiates the native routing navigator, and feeds them directly down into the pure container.
 */
const RepositoryList = () => {
  // Fetch real backend data over the network via custom Apollo hook
  const { repositories } = useRepositories();

  // Initialize router navigation callback engine
  const navigate = useNavigate();

  // Route event coordinator to transition the screen into an individual repo profile view
  const onRepositoryPress = (id) => {
    navigate(`/repository/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onRepositoryPress={onRepositoryPress}
    />
  );
};

export default RepositoryList;
