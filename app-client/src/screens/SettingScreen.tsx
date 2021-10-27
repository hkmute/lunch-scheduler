import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { RoomCode } from "../../AppContext";
import styles from "../styles/styles";
import * as Sentry from "sentry-expo";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { Swipeable, TouchableHighlight } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import ItemSeparator from "../components/ItemSeparator";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import { fetchOptionListDetails } from "../api/api";

export interface OptionListDetails {
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
  const navigation = useNavigation();
  const [settingData, setSettingData] = useState<OptionListDetails | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalValue, setModalValue] = useState("");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      fetchOptionListDetails(code).then((result) => {
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setModalVisible(true)}>
          <View style={{ paddingHorizontal: 16 }}>
            <Ionicons name="add" size={30} color="black" />
          </View>
        </Pressable>
      ),
    });
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOptionListDetails(code).then((result) => {
      setSettingData(result.data);
      setRefreshing(false);
    });
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(code);
    Toast.show("Copied to clipboard");
  };

  const style = StyleSheet.create({
    titleContainer: { padding: 8, backgroundColor: "#DDD" },
    contentContainer: { padding: 16, backgroundColor: theme.colors.background },
    text: { fontSize: 20, textAlign: "center" },
  });

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={style.titleContainer}>
              <Text style={style.text}>房號</Text>
            </View>
            <TouchableHighlight underlayColor="#AAA" onPress={copyToClipboard}>
              <View style={style.contentContainer}>
                <Text style={style.text}>{code}</Text>
              </View>
            </TouchableHighlight>
            <View style={style.titleContainer}>
              <Text style={style.text}>名單</Text>
            </View>
            <View style={style.contentContainer}>
              <Text style={style.text}>{settingData?.name}</Text>
            </View>
            <View style={style.titleContainer}>
              <Text style={style.text}>名單內容</Text>
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
            <View style={style.contentContainer}>
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
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <View
            style={{
              width: "80%",
              height: "30%",
              backgroundColor: theme.colors.background,
              borderColor: "#CCC",
              borderWidth: 1,
              padding: 8,
              justifyContent: "center",
            }}
          >
            <TextInput
              onChangeText={setModalValue}
              value={modalValue}
              placeholder="輸入餐廳"
              style={{
                height: 40,
                width: "100%",
                borderWidth: 1,
                padding: 10,
                marginVertical: 8,
              }}
            />
            <Button
              title="加入"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
