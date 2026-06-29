import { Platform } from "react-native";

/**
 * GLOBAL BRAND DESIGN SYSTEM (theme)
 * WHY IT EXISTS: Centralizes all visual variables (colors, sizing, typography) into a single
 * source of truth. If your firm wants to update its primary branding accent from blue to another
 * color, modifying it here instantly applies the shift across every component layout in the app.
 * * HOW IT WORKS: Other UI layers (`Text.jsx`, `AppBar.jsx`, etc.) import this configuration
 * literal to safely compute style variables instead of guessing hardcoded magic values.
 */
const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#586069",
    primary: "#0366d6",
    appBar: "#24292e", // The deep dark charcoal color matching your navigation strip backgrounds
    appBarText: "#ffffff", // Pure white for text contrast inside the layout headers
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    // SYSTEM PLATFORM RUNTIME DETECTION ABSTRACTION
    // WHY: Android and iOS operating systems ship with distinct built-in default typography fonts.
    // Trying to force standard Apple system fonts onto an Android device layout (or vice versa)
    // will result in visual clipping or runtime warning errors.
    // * HOW IT WORKS: Platform.select intercepts execution at runtime. If the binary is spinning inside
    // an iPhone simulator, it evaluates to "Arial". If running inside an Android image emulator,
    // it yields "Roboto". Everything else falls back safely to the generic "System" rule.
    main: Platform.select({
      android: "Roboto",
      ios: "Arial",
      default: "System",
    }),
  },
  fontWeights: {
    normal: "400",
    bold: "700",
  },
};

export default theme;
