import { API_BASE_URL } from "@env";
import React, { useCallback, useContext, useState } from "react";
import { SafeAreaView } from "react-native";
import { RoomCode } from "../../AppContext";
import styles from "../styles/styles";
import * as Sentry from "sentry-expo";
import { useFocusEffect } from "@react-navigation/core";

export default function SettingScreen() {
  const code = useContext(RoomCode);
  const [settingData, setSettingData] = useState();
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

  const fetchOptionListDetails = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${code}`);
      return await res.json();
    } catch (err) {
      console.log(err);
      Sentry.Native.captureException(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {JSON.stringify(settingData)}
    </SafeAreaView>
  );
}
