import { View, StyleSheet } from "react-native";
import Text from "../Text";
import theme from "../../theme";

const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Horizontal center alignment for the vertical stat stack (number over label)
    flexGrow: 1, // Allows each stat column to expand equally across the horizontal statsSection row
  },
  count: {
    marginBottom: 4, // Pushes the descriptive label text down slightly below the number
  },
});

/**
 * REUSABLE NUMERIC STATISTIC COMPONENT
 * WHY IT EXISTS: Each repository item tracks four unique statistics (Stars, Forks, Reviews, Rating).
 * Instead of repeating the layout logic, text styling, and mathematical formatting functions four
 * separate times, we abstract it into this clean, single-responsibility child component.
 * * * @param {String} label - The text descriptor displayed at the bottom (e.g., "Stars", "Forks")
 * @param {Number} count - The raw integer numerical tally value supplied by the GraphQL backend API
 */
const RepositoryStat = ({ label, count }) => {
  /**
   * MATHEMATICAL FORMATTING UTILITY
   * WHY WE NEED IT: In compliance with standard dashboard designs, large raw metrics numbers
   * need to be truncated for clean horizontal display real-estate (e.g., displaying 21856 looks
   * messy, whereas "21.9k" stays compact and readable).
   * * HOW IT WORKS: If a statistic is 1000 or greater, it divides it by 1000, clips it to one
   * decimal precision place using .toFixed(1), and appends a "k" string tag.
   */
  const formatCount = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      {/* Upper text block displaying the mathematically formatted counter value */}
      <Text fontWeight="bold" style={styles.count}>
        {formatCount(count)}
      </Text>

      {/* Lower descriptive label indicator subtitle text */}
      <Text color="textSecondary">{label}</Text>
    </View>
  );
};

export default RepositoryStat;
