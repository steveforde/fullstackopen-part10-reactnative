import { Platform } from "react-native";

const theme = {
  colors: {
    textPrimary: "#24292e",
    textSecondary: "#586069",
    primary: "#0366d6",
    appBar: "#24292e",
    appBarText: "#ffffff",
  },
  fontSizes: {
    body: 14,
    subheading: 16,
  },
  fonts: {
    // Dynamically assigns the font family based on the active simulator platform
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
