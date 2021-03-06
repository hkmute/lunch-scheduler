import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import * as SecureStore from "expo-secure-store";
import { fetchGoogleLogin } from "../api/auth";
import { User } from "../../AppContext";
import * as Device from "expo-device";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
  const userContext = useContext(User);
  const [userInfo, setUserInfo] = useState("");
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { params } = response;
      const os = Constants.appOwnership === "expo" ? "expo" : Device.osName;
      if (params.id_token) {
        googleLogin(params.id_token, os ?? "");
      }
    }
  }, [response]);

  const googleLogin = async (idToken: string, os: string) => {
    const userInfo = await fetchGoogleLogin(idToken, os);
    if (userInfo) {
      setUserInfo(JSON.stringify(userInfo));
      saveToken(userInfo.token);
      const [user, setUser] = userContext;
      setUser(userInfo.data.name);
    }
  };

  const saveToken = (token: string) => SecureStore.setItemAsync("token", token);
  return (
    <>
      <Button
        disabled={!request}
        title="Google Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <Text>{userInfo}</Text>
    </>
  );
}
