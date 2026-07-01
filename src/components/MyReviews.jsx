import React from "react";
import { FlatList, View, StyleSheet, Pressable, Alert } from "react-native";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-native";

import { GET_CURRENT_USER } from "../graphql/queries";
import { DELETE_REVIEW } from "../graphql/mutations";
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
  },
  topSection: {
    flexDirection: "row",
    marginBottom: 15,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  viewButton: {
    backgroundColor: theme.colors.primary,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#d73a4a", // Red theme indicator for delete action blocks
  },
  buttonText: {
    color: "white",
    fontWeight: theme.fontWeights.bold,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review, onDelete, onView }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("fi-FI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <View style={styles.reviewContainer}>
      {/* TOP SECTION: RATING BADGE AND TEXT BODY */}
      <View style={styles.topSection}>
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

      {/* BOTTOM SECTION: ACTION BUTTONS ROW */}
      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.viewButton]} onPress={onView}>
          <Text style={styles.buttonText}>View repository</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>Delete review</Text>
        </Pressable>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const navigate = useNavigate();

  // Destructure the query's 'refetch' method to trigger cache reloads manually
  const { data, loading, refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "cache-and-network",
    variables: { includeReviews: true },
  });

  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading || !data?.me) {
    return null;
  }

  const reviewNodes = data.me.reviews
    ? data.me.reviews.edges.map((edge) => edge.node)
    : [];

  const handleViewRepository = (repositoryId) => {
    navigate(`/repository/${repositoryId}`);
  };

  const handleDeleteReview = (reviewId) => {
    // Triggers native mobile context prompt module window
    Alert.alert(
      "Delete review",
      "Are you sure you want to delete this review?",
      [
        { text: "CANCEL", style: "cancel" },
        {
          text: "DELETE",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReview({ variables: { id: reviewId } });
              refetch(); // Instantly update view without leaving screen blank
            } catch (e) {
              console.log("Error deleting review:", e.message);
            }
          },
        },
      ],
    );
  };

  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          onView={() => handleViewRepository(item.repository.id)}
          onDelete={() => handleDeleteReview(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default MyReviews;
