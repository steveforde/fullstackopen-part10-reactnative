import { View, Image, StyleSheet, Pressable } from "react-native";
import * as Linking from "expo-linking"; // Native API to open web URLs in the device browser
import Text from "../Text";
import RepositoryStat from "./RepositoryStat";
import theme from "../../theme";

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  topSection: {
    flexDirection: "row",
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flexDirection: "column",
    flexShrink: 1, // Prevents text truncation issues by letting container shrink inside flex-row
    gap: 4,
  },
  badgeContainer: {
    alignSelf: "flex-start", // Snaps background badge wrapper tightly to width of text content
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    overflow: "hidden",
  },
  languageBadge: {
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  githubButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  githubButtonText: {
    color: "white",
    fontWeight: theme.fontWeights.bold,
  },
});

/**
 * REUSABLE PRESENTATIONAL ITEM COMPONENT
 * WHY IT'S DESIGNED THIS WAY: Instead of duplicating layout code across the list dashboard
 * and the individual repository view, we use a single component and modify its layout options
 * via a boolean switch configuration.
 * * @param {Object} item - The repository object metadata from GraphQL.
 * @param {Boolean} showGitHubButton - Flag controlling whether the external action link button appears.
 */
const RepositoryItem = ({ item, showGitHubButton = false }) => {
  // Guard clause against incomplete rendering data loads
  if (!item) return null;

  // Uses Expo Linking layer to switch context out of app sandbox into native browser windows
  const handleOpenGitHub = () => {
    if (item.url) {
      Linking.openURL(item.url);
    }
  };

  return (
    <View style={styles.container} testID="repositoryItem">
      {/* Upper Panel: Profile Avatar image, Full Name metadata, and Description texts */}
      <View style={styles.topSection}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text color="textSecondary">{item.description}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.languageBadge}>{item.language}</Text>
          </View>
        </View>
      </View>

      {/* Middle Panel: Horizontal grid array showing numeric item interaction analytics statistics */}
      <View style={styles.statsSection}>
        <RepositoryStat label="Stars" count={item.stargazersCount} />
        <RepositoryStat label="Forks" count={item.forksCount} />
        <RepositoryStat label="Reviews" count={item.reviewCount} />
        <RepositoryStat label="Rating" count={item.ratingAverage} />
      </View>

      {/* Bottom Panel: Conditional Rendering
        WHY: The button should ONLY show up in the SingleRepository view.
        When rendered inside the RepositoryList dashboard feed, showGitHubButton is false, 
        leaving this node out of the rendering pipeline.
      */}
      {showGitHubButton && (
        <Pressable style={styles.githubButton} onPress={handleOpenGitHub}>
          <Text style={styles.githubButtonText} fontSize="subheading">
            Open in GitHub
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default RepositoryItem;
