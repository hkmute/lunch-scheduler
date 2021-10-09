import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <Text>Home</Text>
      {/* <Button title="To Content" onPress={() => navigation.navigate()}> */}
    </SafeAreaView>
  );
}
