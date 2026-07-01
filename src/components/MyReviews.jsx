import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../graphql/queries";
import Text from "./Text";
import theme from "../theme";

// ==========================================
// 1. LAYOUT STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: "#e1e4e8", // Creates the light gray gap between items
  },
  reviewContainer: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row", // Places the round rating badge side-by-side with the text content
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width/height makes it a perfect circular badge
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center", // Centers rating number horizontally
    justifyContent: "center", // Centers rating number vertically
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  contentContainer: {
    flex: 1, // Forces text section to stretch and fill remaining space without overflowing screen
  },
  usernameText: {
    fontWeight: theme.fontWeights.bold,
    marginBottom: 2,
  },
  dateText: {
    color: "#666",
    marginBottom: 10,
  },
  bodyText: {
    lineHeight: 20, // Prevents text lines from bunching together tightly
  },
});

// Small presentation helper component to cleanly split individual list items
const ItemSeparator = () => <View style={styles.separator} />;

// ==========================================
// 2. PRESENTATIONAL COMPONENT: REVIEW ITEM
// ==========================================
const ReviewItem = ({ review }) => {
  // WHY 'fi-FI': Formats dates consistently into the exact DD.MM.YYYY structure required.
  // e.g., "2026-07-01T11:00:00Z" becomes "01.07.2026"
  const formattedDate = new Date(review.createdAt).toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.reviewContainer}>
      {/* LEFT COLUMN: ROUND RATING BADGE */}
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText} fontSize="subheading">
          {review.rating}
        </Text>
      </View>

      {/* RIGHT COLUMN: TEXT INFRASTRUCTURE */}
      <View style={styles.contentContainer}>
        {/* Displays repository name instead of username since these are the user's personal reviews */}
        <Text style={styles.usernameText} fontSize="subheading">
          {review.repository.fullName}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.bodyText}>{review.text}</Text>
      </View>
    </View>
  );
};

// ==========================================
// 3. MAIN CONTAINER COMPONENT
// ==========================================
const MyReviews = () => {
  // useQuery hook pulls the currently authenticated user profile data
  const { data, loading } = useQuery(GET_CURRENT_USER, {
    // WHY cache-and-network: Hits the local cache first for a lightning-fast render,
    // but fires an underlying network request immediately to catch changes made on other views.
    fetchPolicy: "cache-and-network",

    // WHY includeReviews: true: Triggers the GraphQL @include(if: $includeReviews) directive
    // inside queries.js to append the sub-array data payload only for this view.
    variables: { includeReviews: true },
  });

  // Safe fallback pattern prevents components below from throwing undefined errors
  if (loading || !data?.me) {
    return null;
  }

  // WHY array mapping: Flattens the GraphQL relational "edges/node" connection architecture
  // down into a standard, clean flat array that the React Native FlatList expects.
  const reviewNodes = data.me.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id} // Uses unique node database IDs as keys
    />
  );
};

export default MyReviews;
