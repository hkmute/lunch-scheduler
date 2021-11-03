import React from "react";
import { View, Button, Text } from "react-native";
import { Option, Vote } from "../screens/TodayScreen";
import makeStyles from "../styles/styles";

export default function Choice(props: {
  code: string;
  options: Option[];
  vote: Vote[];
  handlePress: (id: number) => () => Promise<void>;
}) {
  const styles = makeStyles();

  return (
    <View style={{ ...styles.container, justifyContent: "center", margin: 16 }}>
      {props.vote.length ? (
        <>
          <Text style={{ textAlign: "center" }}>
            你今天的選擇是 {props.vote}
          </Text>
          <Text style={{ textAlign: "center" }}>結果會在中午12時抽出</Text>
        </>
      ) : props.options.length ? (
        props.options.map((option) => (
          <View key={option.id} style={{ paddingVertical: 16 }}>
            <Button
              title={option.name}
              onPress={props.handlePress(option.id)}
            />
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center" }}>今天的選擇會在9時開始</Text>
      )}
    </View>
  );
}
