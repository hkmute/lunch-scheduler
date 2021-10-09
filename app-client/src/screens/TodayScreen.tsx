import React from "react";
import { View, Text } from "react-native";
import Choice from "../components/Choice";
import Result from "../components/Result";
import styles from "../styles/styles";

export default function TodayScreen() {
  const result = "";
  return (
    <View style={styles.container}>
      {result ? <Result result={result} /> : <Choice />}
    </View>
  );
}
