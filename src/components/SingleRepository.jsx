import React from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { useParams } from "react-router-native";
import { format, parseISO } from "date-fns";

import useRepository from "../hooks/useRepository";
import RepositoryItem from "./RepositoryList/RepositoryItem";
import theme from "../theme";

// ==========================================
// 1. LAYOUT STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    minHeight: 0,
  },
  separator: {
    height: 10,
    backgroundColor: "#e1e5e8",
  },
  reviewContainer: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
  },
  ratingBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: theme.colors.primary,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.body,
    marginBottom: 10,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    lineHeight: 20,
  },
});

// ==========================================
// 2. PRESENTATIONAL COMPONENT: INDIVIDUAL REVIEW ROW
// ==========================================
const ReviewItem = ({ review }) => {
  const formattedDate = format(parseISO(review.createdAt), "dd MMM yyyy");

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.username}>{review.user.username}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};

const ItemSeparator = () => <View style={styles.separator} />;

// ==========================================
// 3. MAIN CONTAINER COMPONENT
// ==========================================
const SingleRepository = () => {
  const { id } = useParams();

  const { repository, fetchMore, loading } = useRepository({
    id,
    first: 4,
  });

  if (loading || !repository) {
    return <Text>Loading...</Text>;
  }

  const reviews = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewItem review={item} />}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 10 }}>
            <RepositoryItem item={repository} showGitHubButton={true} />
          </View>
        )}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.2} // Tightened threshold to fire cleanly near the window edge
      />
    </View>
  );
};

export default SingleRepository;
