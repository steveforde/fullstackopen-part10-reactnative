import { View, StyleSheet, ScrollView } from "react-native";
import { Link } from "react-router-native";
import Constants from "expo-constants";
import Text from "./Text";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.appBar,
  },
  scrollContainer: {
    flexDirection: "row",
    gap: 20,
  },
  text: {
    color: theme.colors.appBarText,
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      {/* PASTE THE BLOCK HERE: */}
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <Link to="/">
          <Text fontWeight="bold" style={styles.text}>
            Repositories
          </Text>
        </Link>
        <Link to="/signin">
          <Text fontWeight="bold" style={styles.text}>
            Sign in
          </Text>
        </Link>
      </ScrollView>
    </View>
  );
};

export default AppBar;
