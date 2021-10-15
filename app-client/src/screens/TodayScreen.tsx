import { API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { RoomCode } from "../../AppContext";
import Choice from "../components/Choice";
import Result from "../components/Result";
import styles from "../styles/styles";

export default function TodayScreen() {
  const [result, setResult] = useState("");
  const code = useContext(RoomCode);

  return (
    <View style={styles.container}>
      {result ? <Result result={result} /> : <Choice code={code} />}
    </View>
  );
}
