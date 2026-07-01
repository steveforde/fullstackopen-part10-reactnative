import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useQuery } from "@apollo/client/react";
import { GET_CURRENT_USER } from "../graphql/queries";
import Text from "./Text";
import theme from "../theme";

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: "#e1e4e8",
  },
  reviewContainer: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  ratingText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  contentContainer: {
    flex: 1,
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
    lineHeight: 20,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review }) => {
  // Format dates consistently into DD.MM.YYYY structure
  const formattedDate = new Date(review.createdAt).toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText} fontSize="subheading">
          {review.rating}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.usernameText} fontSize="subheading">
          {review.repository.fullName}
        </Text>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.bodyText}>{review.text}</Text>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const { data, loading } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "cache-and-network",
    variables: { includeReviews: true }, // Request the conditional payload explicitly
  });

  if (loading || !data?.me) {
    return null;
  }

  const reviewNodes = data.me.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={(item) => item.id}
    />
  );
};

export default MyReviews;
