import { API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { RoomCode } from "../../AppContext";
import Choice from "../components/Choice";
import Result from "../components/Result";
import styles from "../styles/styles";
import * as Sentry from "sentry-expo";

export default function TodayScreen() {
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/history/${code}/today`);
      return await res.json();
    } catch (err) {
      console.log(err);
      Sentry.Native.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
      {result ? <Result result={result} /> : <Choice code={code} />}
    </View>
  );
}
