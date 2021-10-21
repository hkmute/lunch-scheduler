import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/HomeScreen";
import MainRoute from "./src/routes/MainRoute";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { User } from "./AppContext";
import { ActivityIndicator, Text, View } from "react-native";
import { APP_VERSION } from "@env";
import * as Notifications from "expo-notifications";
import { AndroidNotificationPriority } from "expo-notifications";
import { initSentry } from "./src/utils/sentry";
import * as Sentry from "sentry-expo";
import { MyTheme } from "./theme";

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [user, setUser] = useState("");

  useEffect(() => {
    initSentry();
    getUserData();
    setNotificationHandler();
    scheduleNotificationAsync();
  }, []);

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        setUser(value);
      } else {
        const userId = nanoid();
        await storeUserData(userId);
        setUser(userId);
      }
    } catch (e) {
      console.log(e);
      Sentry.Native.captureException(e);
    }
  };

  const storeUserData = async (value: string) => {
    try {
      await AsyncStorage.setItem("user", value);
    } catch (e) {
      console.log(e);
      Sentry.Native.captureException(e);
    }
  };

  const setNotificationHandler = () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        priority: AndroidNotificationPriority.HIGH,
      }),
    });
  };

  const scheduleNotificationAsync = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "可以投票lunch食乜了",
        body: "立即投票",
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    Notifications.scheduleNotificationAsync({
      content: {
        title: "可以查看lunch食乜了",
        body: "立即查看",
      },
      trigger: {
        hour: 12,
        minute: 0,
        repeats: true,
      },
    });
  };

  return (
    <>
      <User.Provider value={user}>
        {user ? (
          <NavigationContainer theme={MyTheme}>
            <Stack.Navigator>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Main"
                component={MainRoute}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <ActivityIndicator />
        )}
        <View
          style={{
            paddingHorizontal: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>{user}</Text>
          <Text>{APP_VERSION}</Text>
        </View>
        <StatusBar style="auto" />
      </User.Provider>
    </>
  );
}
