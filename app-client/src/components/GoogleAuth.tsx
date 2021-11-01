import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { ANDROID_CLIENT_ID, EXPO_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { ResponseType } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { fetchGoogleLogin } from "../api/api";
import { User } from "../../AppContext";
import * as Device from "expo-device";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
  const userContext = useContext(User);
  const [userInfo, setUserInfo] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: ResponseType.Code,
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    shouldAutoExchangeCode: false,
    usePKCE: false,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { params } = response;
      const os = Constants.appOwnership === "expo" ? "expo" : Device.osName;
      if (params.code) {
        googleLogin(params.code, os ?? "");
      }
    }
  }, [response]);

  const googleLogin = async (authCode: string, os: string) => {
    const userInfo = await fetchGoogleLogin(authCode, os);
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
      <Text>{JSON.stringify(response)}</Text>
    </>
  );
}
