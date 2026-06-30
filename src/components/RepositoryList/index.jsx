import React, { useState } from "react";
import { FlatList, View, StyleSheet, Pressable, TextInput } from "react-native";
import { useNavigate } from "react-router-native";
import { Picker } from "@react-native-picker/picker";
import { useDebounce } from "use-debounce";
import RepositoryItem from "./RepositoryItem";
import useRepositories from "../../hooks/useRepositories";

// Define visual spacing and container styling
const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  headerContainer: {
    padding: 10,
    backgroundColor: "#e1e4e8",
    gap: 10, // Adds gap between search input and picker dropdown
  },
  searchBar: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  picker: {
    backgroundColor: "white",
    borderRadius: 5,
  },
});

// Small presentational component to render a gap between rows in the FlatList
const ItemSeparator = () => <View style={styles.separator} />;

/**
 * 0. HEADER PICKER SELECTION COMPONENT
 * WHY IT EXISTS: Isolates the dropdown menu display rendering logic. Placing this within
 * the FlatList's ListHeaderComponent ensures it stays at the absolute top of the screen
 * but rolls up naturally out of view when a user scrolls deep down into the list.
 * UPDATE: Added a TextInput text field layout to support text searching alongside sorting filter controls.
 */
const RepositoryListHeader = ({
  selectedOrder,
  setSelectedOrder,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Real-time textual search field */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search repositories..."
        placeholderTextColor="#aaa"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <Picker
        style={styles.picker}
        selectedValue={selectedOrder}
        onValueChange={(itemValue) => setSelectedOrder(itemValue)}
      >
        {/* Adds a descriptive placeholder item at index 0 */}
        <Picker.Item
          label="Select an item..."
          value="LATEST"
          enabled={false}
          style={{ color: "#aaa" }}
        />
        <Picker.Item label="Latest repositories" value="LATEST" />
        <Picker.Item label="Highest rated repositories" value="HIGHEST_RATED" />
        <Picker.Item label="Lowest rated repositories" value="LOWEST_RATED" />
      </Picker>
    </View>
  );
};

/**
 * 1. PRESENTATIONAL / PURE CONTAINER
 * WHY IT EXISTS: This component handles ONLY UI rendering. By keeping it "pure" and free of
 * data-fetching hooks (useQuery) or routing hooks (useNavigate), we can easily test it in
 * Jest without setting up complex wrappers or mocking native router contexts.
 */
export const RepositoryListContainer = ({
  repositories,
  onRepositoryPress,
  selectedOrder,
  setSelectedOrder,
  searchQuery,
  setSearchQuery,
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
        <Pressable onPress={() => onRepositoryPress(item.id)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <RepositoryListHeader
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
    />
  );
};

/**
 * 2. SMART CONTAINER / WRAPPER
 * WHY IT EXISTS: This component handles side-effects, real runtime hooks, and state management.
 */
const RepositoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState("LATEST");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce the raw typing string state by 500 milliseconds to optimize network requests
  const [debouncedSearchKeyword] = useDebounce(searchQuery, 500);

  // Helper dictionary transforming select states directly into GraphQL parameters
  const getQueryVariables = () => {
    const baseVariables = {
      searchKeyword: debouncedSearchKeyword,
    };

    switch (selectedOrder) {
      case "HIGHEST_RATED":
        return {
          ...baseVariables,
          orderBy: "RATING_AVERAGE",
          orderDirection: "DESC",
        };
      case "LOWEST_RATED":
        return {
          ...baseVariables,
          orderBy: "RATING_AVERAGE",
          orderDirection: "ASC",
        };
      case "LATEST":
      default:
        return {
          ...baseVariables,
          orderBy: "CREATED_AT",
          orderDirection: "DESC",
        };
    }
  };

  // Fetch data, passing down dynamic variable configurations directly to your custom hook
  const { repositories } = useRepositories(getQueryVariables());

  // Initialize router navigation callback engine
  const navigate = useNavigate();

  const onRepositoryPress = (id) => {
    navigate(`/repository/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onRepositoryPress={onRepositoryPress}
      selectedOrder={selectedOrder}
      setSelectedOrder={setSelectedOrder}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
};

export default RepositoryList;
