import { Text as NativeText, StyleSheet } from "react-native";
import theme from "../theme";

// Baseline design system style token configurations
const styles = StyleSheet.create({
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
    fontFamily: theme.fonts.main,
    fontWeight: theme.fontWeights.normal,
  },
  colorTextSecondary: {
    color: theme.colors.textSecondary,
  },
  colorPrimary: {
    color: theme.colors.primary,
  },
  fontSizeSubheading: {
    fontSize: theme.fontSizes.subheading,
  },
  fontWeightBold: {
    fontWeight: theme.fontWeights.bold,
  },
});

/**
 * CUSTOM DESIGN SYSTEM TYPOGRAPHY UTILITY (Text)
 * WHY IT EXISTS: React Native's native <Text> component doesn't inherit styles globally from
 * parent containers like web CSS does. Instead of manually copying font families, weights, and colors
 * across dozens of files, this wrapper acts as a centralized typography manager.
 * * HOW IT WORKS: It accepts semantic shorthand props (e.g., fontWeight="bold") and maps them
 * against a central theme file.
 */
const Text = ({ color, fontSize, fontWeight, style, ...props }) => {
  // DYNAMIC STYLE COMPOSITION ARRAY
  // WHY: Array style evaluation allows properties to override each other from top to bottom.
  // 1. styles.text applies the fallback global typography baseline rules.
  // 2. The conditional evaluations look at props and append variations if true.
  // 3. The final `style` prop allows developer overrides directly from parent layouts.
  const textStyle = [
    styles.text,
    color === "textSecondary" && styles.colorTextSecondary,
    color === "primary" && styles.colorPrimary,
    fontSize === "subheading" && styles.fontSizeSubheading,
    fontWeight === "bold" && styles.fontWeightBold,
    style, // Crucial: Always placed last so manual style extensions override theme variations
  ];

  // Rest spread operator (`...props`) forwards standard attributes like testID or numberOfLines down safely
  return <NativeText style={textStyle} {...props} />;
};

export default Text;
