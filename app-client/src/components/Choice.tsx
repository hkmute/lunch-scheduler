import { API_BASE_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Button, Text } from "react-native";
import styles from "../styles/styles";

interface Option {
  id: number;
  date: string;
  name: string;
}

export default function Choice(props: { code: string }) {
  const [options, setOptions] = useState<Option[]>([]);
  const [vote, setVote] = useState();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchTodayVote().then((vote) => {
        if (vote.data.length) {
          if (isActive) {
            setVote(vote.data[0].name);
          }
          return;
        }
        fetchTodayOptions().then((result) => {
          if (isActive) {
            setOptions(result.data);
          }
        });
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const fetchTodayOptions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/today-options/${props.code}`);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTodayVote = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/votes/${props.code}?user=string`
      );
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  const handlePress = (id: number) => async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/votes/${props.code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: "string",
          optionId: id,
        }),
      });
      if (res.ok) {
        const vote = await fetchTodayVote();
        setVote(vote.data[0].name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ ...styles.container, justifyContent: "center", margin: 16 }}>
      {vote ? (
        <Text style={{ textAlign: "center" }}>你今天的選擇是 {vote}</Text>
      ) : (
        options.map((option) => (
          <View key={option.id} style={{ paddingVertical: 16 }}>
            <Button title={option.name} onPress={handlePress(option.id)} />
          </View>
        ))
      )}
    </View>
  );
}
