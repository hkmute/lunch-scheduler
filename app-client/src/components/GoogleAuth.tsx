import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useContext, useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { EXPO_CLIENT_ID } from "@env";
import { ResponseType } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { fetchGoogleLogin } from "../api/api";
import { User } from "../../AppContext";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
  const userContext = useContext(User);
  const [userInfo, setUserInfo] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: ResponseType.Code,
    expoClientId: EXPO_CLIENT_ID,
    iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    webClientId: "GOOGLE_GUID.apps.googleusercontent.com",
    shouldAutoExchangeCode: false,
    usePKCE: false,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { params } = response;
      if (params.code) {
        googleLogin(params.code);
      }
    }
  }, [response]);

  const googleLogin = async (authCode: string) => {
    const userInfo = await fetchGoogleLogin(authCode);
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
