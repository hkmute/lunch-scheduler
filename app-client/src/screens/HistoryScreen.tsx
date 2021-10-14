import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView, FlatList, View, Text } from "react-native";
import styles from "../styles/styles";
import { API_BASE_URL } from "@env";
import { format, parseISO } from "date-fns";
import { RoomCode } from "../../AppContext";
import { useFocusEffect } from "@react-navigation/native";

interface HistoryItem {
  id: 0;
  date: "string";
  name: "string";
}

export default function HistoryScreen() {
  const code = useContext(RoomCode);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchHistory().then((result) => {
        if (isActive) {
          setHistoryData(result.data);
        }
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${code}`);
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={historyData}
        renderItem={({ item }) => (
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 16,
              flexDirection: "row",
            }}
          >
            <Text style={{ flex: 1, textAlign: "center" }}>
              {format(parseISO(item.date), "yyyy-MM-dd")}
            </Text>
            <Text style={{ flex: 2, textAlign: "center" }}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => String(item.id)}
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
