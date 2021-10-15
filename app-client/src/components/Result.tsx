import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";

export default function Result(props: { result: string }) {
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
