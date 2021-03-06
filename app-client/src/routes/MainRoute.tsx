import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import React, { useCallback } from "react";
import HistoryScreen from "../screens/HistoryScreen";
import TodayScreen from "../screens/TodayScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RoomCode } from "../../AppContext";
import {
  CompositeNavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { format } from "date-fns";
import SettingScreen from "../screens/SettingScreen";
import { View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Main">;
type MainNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, "Main">,
  BottomTabNavigationProp<RootBottomTabParamList>
>;

export default function MainRoute({ route }: Props) {
  const navigation = useNavigation<MainNavigationProp>();
  const Tab = createBottomTabNavigator<RootBottomTabParamList>();
  const code = route.params.code;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (!code) {
        navigation.navigate("Home");
      }
      return () => {
        isActive = false;
      };
    }, [code])
  );

  return (
    <RoomCode.Provider value={code}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            switch (route.name) {
              case "Today": {
                return <Ionicons name="today" size={size} color={color} />;
              }
              case "History": {
                return (
                  <FontAwesome5 name="history" size={size} color={color} />
                );
              }
              case "Setting": {
                return (
                  <Ionicons
                    name="md-settings-sharp"
                    size={size}
                    color={color}
                  />
                );
              }
            }
          },
        })}
      >
        <Tab.Screen
          name="Today"
          component={TodayScreen}
          options={{
            tabBarLabel: "??????",
            headerTitle: format(new Date(), "yyyy-MM-dd"),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: "??????",
            headerTitle: "????????????",
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            tabBarLabel: "??????",
            headerTitle: "??????",
          }}
        />
      </Tab.Navigator>
    </RoomCode.Provider>
  );
}
