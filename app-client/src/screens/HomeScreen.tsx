import {
  useNavigation,
  CompositeNavigationProp,
} from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Button, TextInput, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import GoogleAuth from "../components/GoogleAuth";
import { User } from "../../AppContext";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "Home">,
  BottomTabNavigationProp<RootBottomTabParamList>
>;

export default function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const user = useContext(User);

  const onSubmit = () => {
    if (code) {
      setError(false);
      navigation.navigate("Main", { code });
    } else {
      setError(true);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      {!!user && (
        <Text style={{ fontSize: 16, width: "50%", marginBottom: 8 }}>
          你好，{user}
        </Text>
      )}
      <Text style={{ fontSize: 20, width: "50%" }}>輸入編號：</Text>
      <TextInput
        onChangeText={setCode}
        value={code}
        style={{
          height: 40,
          width: "50%",
          margin: 12,
          borderWidth: 1,
          padding: 10,
          borderColor: error ? "red" : undefined,
        }}
      />
      <View style={{ width: "30%" }}>
        <Button title="進入" onPress={onSubmit} />
      </View>
      <View style={{ margin: 2 }}>{!user && <GoogleAuth />}</View>
    </SafeAreaView>
  );
}
