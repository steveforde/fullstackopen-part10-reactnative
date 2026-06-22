import { View, Image, StyleSheet } from "react-native";
import Text from "./Text";
import RepositoryStat from "./RepositoryStat";
import theme from "../theme";

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
    flexShrink: 1,
    alignItems: "flex-start",
  },
  description: {
    marginVertical: 5,
  },
  languageBadge: {
    color: "#fff",
    backgroundColor: theme.colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 4,
    overflow: "hidden", // Required for borderRadius on iOS Text components
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Upper Info Block */}
      <View style={styles.topSection}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text color="textSecondary" style={styles.description}>
            {item.description}
          </Text>
          <Text style={styles.languageBadge}>{item.language}</Text>
        </View>
      </View>

      {/* Bottom Row Stats Block */}
      <View style={styles.statsSection}>
        <RepositoryStat label="Stars" count={item.stargazersCount} />
        <RepositoryStat label="Forks" count={item.forksCount} />
        <RepositoryStat label="Reviews" count={item.reviewCount} />
        <RepositoryStat label="Rating" count={item.ratingAverage} />
      </View>
    </View>
  );
};

export default RepositoryItem;
