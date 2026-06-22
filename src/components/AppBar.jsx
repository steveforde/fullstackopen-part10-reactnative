import { View, StyleSheet, Pressable } from "react-native";
import Constants from "expo-constants";
import Text from "./Text";
import theme from "../theme";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 15, // Pushes text down safely below notch
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.appBar,
  },
  text: {
    color: theme.colors.appBarText,
  },
});

const AppBar = () => {
  return (
    <View style={styles.container}>
      <Pressable>
        <Text fontWeight="bold" fontSize="subheading" style={styles.text}>
          Repositories
        </Text>
      </Pressable>
    </View>
  );
};

export default AppBar;
