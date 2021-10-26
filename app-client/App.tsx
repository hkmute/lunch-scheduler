import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/HomeScreen";
import MainRoute from "./src/routes/MainRoute";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { Guest, User } from "./AppContext";
import { ActivityIndicator, Text, View } from "react-native";
import { API_BASE_URL, APP_VERSION } from "@env";
import { initSentry } from "./src/utils/sentry";
import * as Sentry from "sentry-expo";
import { MyTheme } from "./theme";
import { initNotifications } from "./src/notifications/notifications";
import * as SecureStore from "expo-secure-store";

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [guest, setGuest] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initSentry();
    getGuestData();
    getToken().then(async (token) => {
      if (token) {
        await getUserData(token);
      }
      setLoading(false);
    });
    initNotifications();
  }, []);

  const getGuestData = async () => {
    try {
      const value = await AsyncStorage.getItem("guest");
      if (value !== null) {
        setGuest(value);
      } else {
        const userId = nanoid();
        await storeGuestData(userId);
        setGuest(userId);
      }
    } catch (err) {
      console.log(err);
      Sentry.Native.captureException(err);
    }
  };

  const storeGuestData = async (value: string) => {
    try {
      await AsyncStorage.setItem("user", value);
    } catch (e) {
      console.log(e);
      Sentry.Native.captureException(e);
    }
  };

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        setToken(token);
      }
      return token;
    } catch (err) {
      console.log(err);
      Sentry.Native.captureException(err);
    }
  };

  const getUserData = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        return await SecureStore.deleteItemAsync("token");
      }
      const userInfo = await res.json();
      setUser(userInfo.data.name);
    } catch (err) {
      console.log(err);
      Sentry.Native.captureException(err);
    }
  };

  return (
    <Guest.Provider value={guest}>
      <User.Provider value={user}>
        {!loading && guest ? (
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
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color="#999" />
          </View>
        )}
        <View
          style={{
            paddingHorizontal: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text>Guest: {guest}</Text>
            <Text>Token: {token}</Text>
          </View>
          <Text>{APP_VERSION}</Text>
        </View>
        <StatusBar style="auto" />
      </User.Provider>
    </Guest.Provider>
  );
}
