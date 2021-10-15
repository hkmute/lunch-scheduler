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
import { Text } from "react-native";

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [user, setUser] = useState("");

  useEffect(() => {
    getUserData();
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
    }
  };

  const storeUserData = async (value: string) => {
    try {
      await AsyncStorage.setItem("user", value);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <User.Provider value={user}>
        {!!user && (
          <NavigationContainer>
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
        )}
        <Text>UserId: {user}</Text>
        <StatusBar style="auto" />
      </User.Provider>
    </>
  );
}
