import { View, Image, StyleSheet } from "react-native";
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
    flexShrink: 1,
    gap: 4,
  },
  badgeContainer: {
    alignSelf: "flex-start", // Forces the container to wrap the text tightly on Web
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
  },
});

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" fontSize="subheading">
            {item.fullName}
          </Text>
          <Text color="textSecondary">{item.description}</Text>
          {/* Wrapped in a self-starting container */}
          <View style={styles.badgeContainer}>
            <Text style={styles.languageBadge}>{item.language}</Text>
          </View>
        </View>
      </View>

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
