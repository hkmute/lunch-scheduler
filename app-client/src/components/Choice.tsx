import React from "react";
import { View, Button } from "react-native";
import styles from "../styles/styles";

export default function Choice() {
  const handlePress = () => {};
  return (
    <View style={{ ...styles.container, justifyContent: "center", margin: 16 }}>
      <View style={{ paddingVertical: 16 }}>
        <Button title="Option 1" onPress={handlePress} />
      </View>
      <View style={{ paddingVertical: 16 }}>
        <Button title="Option 2" onPress={handlePress} />
      </View>
      <View style={{ paddingVertical: 16 }}>
        <Button title="Option 3" onPress={handlePress} />
      </View>
    </View>
  );
}
