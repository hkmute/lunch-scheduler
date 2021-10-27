import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { RoomCode, Guest } from "../../AppContext";
import {
  fetchTodayResult,
  fetchTodayVote,
  fetchTodayOptions,
  postTodayVote,
} from "../api/api";
import Choice from "../components/Choice";
import Result from "../components/Result";
import styles from "../styles/styles";

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
  const [loading, setLoading] = useState(true);
  const code = useContext(RoomCode);
  const user = useContext(Guest);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchTodayResult(code).then((result) => {
        if (isActive) {
          if (result.data) {
            return setResult(result?.data?.name ?? null);
          }
          fetchTodayVote(code, user).then((vote) => {
            if (isActive) {
              if (vote?.data.length) {
                return setVote(vote.data[0].name);
              }
              fetchTodayOptions(code).then((result) => {
                return setOptions(result.data);
              });
            }
          });
        }
        setLoading(false);
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const handlePress = (id: number) => async () => {
    const ok = await postTodayVote(id, code, user);
    if (ok) {
      const vote = await fetchTodayVote(code, user);
      if (vote?.data.length) {
        setVote(vote.data[0].name);
      }
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
