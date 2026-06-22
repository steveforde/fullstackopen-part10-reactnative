import { View, StyleSheet } from "react-native";
import Text from "./Text";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  count: {
    marginBottom: 4,
  },
});

const RepositoryStat = ({ label, count }) => {
  const formatCount = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <Text fontWeight="bold" style={styles.count}>
        {formatCount(count)}
      </Text>
      <Text color="textSecondary">{label}</Text>
    </View>
  );
};

export default RepositoryStat;
