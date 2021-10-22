import { API_BASE_URL } from "@env";
import React, { useCallback, useContext, useState } from "react";
import {
  Button,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { RoomCode } from "../../AppContext";
import styles from "../styles/styles";
import * as Sentry from "sentry-expo";
import { useFocusEffect } from "@react-navigation/core";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import ItemSeparator from "../components/ItemSeparator";

interface OptionListDetails {
  id: number;
  name: string;
  details: {
    optionId: number;
    optionName: string;
  }[];
}

export default function SettingScreen() {
  const theme = useTheme();
  const code = useContext(RoomCode);
  const [settingData, setSettingData] = useState<OptionListDetails | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchOptionListDetails().then((result) => {
        if (isActive) {
          setSettingData(result.data);
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
    fetchOptionListDetails().then((result) => {
      setSettingData(result.data);
      setRefreshing(false);
    });
  }, []);

  const fetchOptionListDetails: () => Promise<{ data: OptionListDetails }> =
    async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/option-list/${code}/details`);
        return await res.json();
      } catch (err) {
        console.log(err);
        Sentry.Native.captureException(err);
      }
    };

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={{ padding: 8, backgroundColor: "#DDD" }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>名單</Text>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                {settingData?.name}
              </Text>
            </View>
            <View style={{ padding: 8, backgroundColor: "#DDD" }}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                名單內容
              </Text>
            </View>
          </>
        }
        data={settingData?.details}
        renderItem={(data) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableHighlight underlayColor="#DDD" onPress={() => {}}>
                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    padding: 16,
                    borderLeftWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </View>
              </TouchableHighlight>
            )}
          >
            <View
              style={{ padding: 16, backgroundColor: theme.colors.background }}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>
                {data.item.optionName}
              </Text>
            </View>
          </Swipeable>
        )}
        keyExtractor={(item) => item.optionId.toString()}
        ItemSeparatorComponent={ItemSeparator}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}
