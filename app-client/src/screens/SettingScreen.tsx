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
  Modal,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { RoomCode } from "../../AppContext";
import { useFocusEffect, useNavigation } from "@react-navigation/core";
import { TouchableHighlight } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import ItemSeparator from "../components/ItemSeparator";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import { addOption, deleteOption, fetchOptionListDetails } from "../api/api";
import makeStyles from "../styles/styles";
import SwipeableListItem from "../components/SwipeableListItem";

export interface OptionListDetails {
  id: number;
  name: string;
  details: {
    id: number;
    optionId: number;
    optionName: string;
  }[];
}

export default function SettingScreen() {
  const theme = useTheme();
  const styles = makeStyles(theme);
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

  const handleDelete = (id: number) => async () => {
    await deleteOption(settingData!.id, id);
    const newList = await fetchOptionListDetails(code);
    setSettingData(newList.data);
  };

  const handleAdd = async () => {
    if (!settingData?.id || !modalValue) {
      return Toast.show("請輸入餐廳");
    }
    await addOption(settingData.id, modalValue);
    const newList = await fetchOptionListDetails(code);
    setSettingData(newList.data);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.titleContainer}>
              <Text style={styles.text}>房號</Text>
            </View>
            <TouchableHighlight underlayColor="#AAA" onPress={copyToClipboard}>
              <View style={styles.contentContainer}>
                <Text style={styles.text}>{code}</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.titleContainer}>
              <Text style={styles.text}>名單</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>{settingData?.name}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.text}>名單內容</Text>
            </View>
          </>
        }
        data={settingData?.details}
        renderItem={(data) => (
          <SwipeableListItem
            content={data.item.optionName}
            rightAction={
              <TouchableHighlight
                underlayColor="#DDD"
                onPress={handleDelete(data.item.id)}
              >
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
            }
          />
        )}
        keyExtractor={(item) => item.id.toString()}
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
            <Button title="加入" onPress={handleAdd} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
