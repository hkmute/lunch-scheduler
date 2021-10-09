import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HistoryScreen from "../screens/HistoryScreen";
import TodayScreen from "../screens/TodayScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

export default function MainRoute() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "Today": {
              return <Ionicons name="today" size={size} color={color} />;
            }
            case "History": {
              return <FontAwesome5 name="history" size={size} color={color} />;
            }
          }
        },
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}
