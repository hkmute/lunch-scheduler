import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import React, { useEffect, useState } from "react";
import { Button, Text } from "react-native";
import { API_BASE_URL, EXPO_CLIENT_ID } from "@env";
import * as Sentry from "sentry-expo";
import { ResponseType } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth() {
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
    try {
      const res = await fetch(`${API_BASE_URL}/login/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authCode,
        }),
      });
      const userInfo: { token: string; data: { name: string } } =
        await res.json();
      setUserInfo(JSON.stringify(userInfo));
      saveToken(userInfo.token);
      return;
    } catch (err) {
      Sentry.Native.captureException(err);
      console.log(err);
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
