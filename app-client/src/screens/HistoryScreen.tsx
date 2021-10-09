import React from "react";
import { SafeAreaView, FlatList, View, Text } from "react-native";
import styles from "../styles/styles";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    date: new Date(),
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    date: new Date(),
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    date: new Date(),
    title: "Third Item",
  },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 16,
              flexDirection: "row",
            }}
          >
            <Text style={{ flex: 1, textAlign: "center" }}>
              {item.date.toLocaleDateString()}
            </Text>
            <Text style={{ flex: 2, textAlign: "center" }}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: "#CED0CE",
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
