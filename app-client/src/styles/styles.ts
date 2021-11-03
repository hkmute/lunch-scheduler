import { Theme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const makeStyles = (theme?: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    titleContainer: { padding: 8, backgroundColor: "#DDD" },
    contentContainer: {
      padding: 16,
      backgroundColor: theme?.colors.background,
    },
    text: { fontSize: 20, textAlign: "center" },
  });

export default makeStyles;
