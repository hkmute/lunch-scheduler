import MaterialIcons from "@expo/vector-icons/build/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import makeStyles from "../styles/styles";

export default function SwipeableListItem(props: {
  content: string;
  rightAction: ReactNode;
}) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <Swipeable renderRightActions={() => props.rightAction}>
      <View style={styles.contentContainer}>
        <Text style={{ fontSize: 16, textAlign: "center" }}>
          {props.content}
        </Text>
      </View>
    </Swipeable>
  );
}
