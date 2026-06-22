import { View, StyleSheet } from "react-native";
import Text from "./Text";

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
});

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text fontWeight="bold" fontSize="subheading">
        {item.fullName}
      </Text>
      <Text color="textSecondary" style={{ marginVertical: 5 }}>
        {item.description}
      </Text>
      <Text>Language: {item.language}</Text>
      <Text>Stars: {item.stargazersCount}</Text>
      <Text>Forks: {item.forksCount}</Text>
      <Text>Reviews: {item.reviewCount}</Text>
      <Text>Rating: {item.ratingAverage}</Text>
    </View>
  );
};

export default RepositoryItem;
