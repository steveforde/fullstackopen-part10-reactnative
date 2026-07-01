import React from "react";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { useParams } from "react-router-native";
import { format, parseISO } from "date-fns"; // Standard UI timestamp utility mapping library

import useRepository from "../hooks/useRepository";
import RepositoryItem from "./RepositoryList/RepositoryItem";
import theme from "../theme";

// ==========================================
// 1. LAYOUT STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: "#e1e5e8", // Creates the visual whitespace gap between individual reviews
  },
  reviewContainer: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row", // Places the round rating badge horizontally side-by-side with text strings
  },
  ratingBadge: {
    width: 50,
    height: 50,
    borderRadius: 25, // Forces a perfect circular badge profile shape (width / 2)
    borderColor: theme.colors.primary,
    borderWidth: 2,
    alignItems: "center", // Horizontally centers the numeric rating value inside the circle
    justifyContent: "center", // Vertically centers the numeric rating value inside the circle
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
    fontSize: theme.fontSizes.subheading,
  },
  contentContainer: {
    flex: 1, // Permits text boxes to wrap clean dynamically instead of overflowing device viewport walls
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
    lineHeight: 20, // Increases readability by adding space between sentence lines
  },
});

// ==========================================
// 2. PRESENTATIONAL COMPONENT: INDIVIDUAL REVIEW ROW
// ==========================================
const ReviewItem = ({ review }) => {
  // WHY parseISO + format: Decodes raw incoming ISO UTC string values into legible formats.
  // e.g., "2026-07-01T11:00:00Z" outputs explicitly as "01 Jul 2026"
  const formattedDate = format(parseISO(review.createdAt), "dd MMM yyyy");

  return (
    <View style={styles.reviewContainer}>
      {/* LEFT COLUMN: RATING BADGE */}
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{review.rating}</Text>
      </View>

      {/* RIGHT COLUMN: REVIEWS BODY DETAIL TEXT */}
      <View style={styles.contentContainer}>
        {/* Displays the specific user who left this review */}
        <Text style={styles.username}>{review.user.username}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};

// Item separator structural layout block passed down to FlatList configuration
const ItemSeparator = () => <View style={styles.separator} />;

// ==========================================
// 3. MAIN CONTAINER COMPONENT
// ==========================================
const SingleRepository = () => {
  // Pulls string routing parameters dynamically straight from the URL path window
  // e.g., if path is /repository/jaredpalmer.formik, id evaluates to "jaredpalmer.formik"
  const { id } = useParams();

  // Custom execution data layer hook pulling data metrics via GraphQL network queries
  const { repository, loading } = useRepository(id);

  // Loading state placeholder guards fields from evaluating as undefined during runtime operations
  if (loading || !repository) {
    return <Text>Loading...</Text>;
  }

  // WHY edge mapping: Converts connection-based page parameters (edges/node framework matching)
  // down into a standard flat JavaScript array that the FlatList configuration tracks cleanly.
  const reviews = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id} // Uses unique review database string hash values as tracking keys
      ItemSeparatorComponent={ItemSeparator}
      // WHY ListHeaderComponent: Implements the baseline core info row up top inside the scroll tracks.
      // This allows the repository details panel and the review list elements to scroll together
      // smoothly as a unified container instead of fighting with layout viewport issues.
      ListHeaderComponent={() => (
        <View style={{ marginBottom: 10 }}>
          {/* Renders the reusable overview info block while unlocking the optional GitHub action button trigger */}
          <RepositoryItem item={repository} showGitHubButton={true} />
        </View>
      )}
    />
  );
};

export default SingleRepository;
