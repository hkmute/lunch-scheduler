import { API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { RoomCode, User } from "../../AppContext";
import Choice from "../components/Choice";
import Result from "../components/Result";
import styles from "../styles/styles";
import * as Sentry from "sentry-expo";

export interface Option {
  id: number;
  date: string;
  name: string;
}

export interface Vote {
  id: number;
  date: string;
  name: string;
  user: string;
  optionId: number;
}

export default function TodayScreen() {
  const [result, setResult] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [vote, setVote] = useState<Vote[]>([]);
  const loading = !result && !options.length && !vote.length;
  const code = useContext(RoomCode);
  const user = useContext(User);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchTodayResult().then((result) => {
        if (isActive) {
          if (result) {
            return setResult(result?.data?.name ?? null);
          }
          fetchTodayVote().then((vote) => {
            if (isActive) {
              if (vote?.data.length) {
                return setVote(vote.data[0].name);
              }
              fetchTodayOptions().then((result) => {
                return setOptions(result.data);
              });
            }
          });
        }
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
      Sentry.Native.captureException(err);
    }
  };

  const fetchTodayOptions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/today-options/${code}`);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTodayVote = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/votes/${code}?user=${user}`);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePress = (id: number) => async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/votes/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          optionId: id,
        }),
      });
      if (res.ok) {
        const vote = await fetchTodayVote();
        if (vote.data.length) {
          setVote(vote.data[0].name);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#999" />
        </View>
      ) : result ? (
        <Result result={result} />
      ) : (
        <Choice
          code={code}
          options={options}
          vote={vote}
          handlePress={handlePress}
        />
      )}
    </View>
  );
}
