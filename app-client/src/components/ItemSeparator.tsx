import { useTheme } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

export default function ItemSeparator() {
  const theme = useTheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: theme.colors.border,
      }}
    />
  );
}
