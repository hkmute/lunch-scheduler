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
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchTodayResult().then((result) => {
        if (isActive) {
          setResult(result?.data?.name ?? null);
        }
        return;
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const fetchTodayResult = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${code}/today`);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {result === null ? <Choice code={code} /> : <Result result={result} />}
    </View>
  );
}
