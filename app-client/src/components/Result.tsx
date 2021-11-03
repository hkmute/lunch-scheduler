import React from "react";
import { View, Text } from "react-native";
import makeStyles from "../styles/styles";

export default function Result(props: { result: string }) {
  const styles = makeStyles();

  return (
    <View
      style={{
        ...styles.container,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 32 }}>結果：{props.result}</Text>
    </View>
  );
}
