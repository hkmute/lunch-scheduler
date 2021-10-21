import React, { useCallback, useContext, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import styles from "../styles/styles";
import { API_BASE_URL } from "@env";
import { format, parseISO } from "date-fns";
import { RoomCode } from "../../AppContext";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import * as Sentry from "sentry-expo";
interface HistoryItem {
  id: number;
  date: string;
  name: string;
}

export default function HistoryScreen() {
  const theme = useTheme();
  const code = useContext(RoomCode);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchHistory().then((result) => {
        if (isActive) {
          setHistoryData(result.data);
          if (loading) {
            setLoading(false);
          }
        }
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory().then((result) => {
      setHistoryData(result.data);
      setRefreshing(false);
    });
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${code}`);
      return await res.json();
    } catch (err) {
      console.log(err);
      Sentry.Native.captureException(err);
    }
  };

  return (
    <SafeAreaView style={{ ...styles.container, justifyContent: "center" }}>
      {loading ? (
        <ActivityIndicator />
      ) : historyData.length ? (
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
              <Text style={{ flex: 1, textAlign: "center", fontSize: 16 }}>
                {format(parseISO(item.date), "yyyy-MM-dd")}
              </Text>
              <Text style={{ flex: 2, textAlign: "center", fontSize: 16 }}>
                {item.name}
              </Text>
            </View>
          )}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: theme.colors.border,
              }}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={{ textAlign: "center" }}>未有歷史記錄</Text>
      )}
    </SafeAreaView>
  );
}
