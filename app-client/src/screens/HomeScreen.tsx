import {
  useNavigation,
  CompositeNavigationProp,
} from "@react-navigation/native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "Home">,
  BottomTabNavigationProp<RootBottomTabParamList>
>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [code, setCode] = useState("");

  const onSubmit = () => {
    navigation.navigate("Main", { code });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <TextInput
        onChangeText={setCode}
        value={code}
        style={{
          height: 40,
          width: "50%",
          margin: 12,
          borderWidth: 1,
          padding: 10,
        }}
      />
      <Button title="To Content" onPress={onSubmit} />
    </SafeAreaView>
  );
}
