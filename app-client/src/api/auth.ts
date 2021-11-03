import * as SecureStore from "expo-secure-store";
import { API_BASE_URL } from "@env";
import * as Sentry from "sentry-expo";
import Toast from "react-native-root-toast";

export const fetchGoogleLogin = async (idToken: string, os: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        os,
      }),
    });
    const userInfo = await res.json();
    if (!res.ok) throw new Error(userInfo.message);
    return userInfo as { token: string; data: { name: string } };
  } catch (err) {
    if (err instanceof Error) {
      Toast.show(err.message);
    }
    Sentry.Native.captureException(err);
  }
};

export const fetchUserData = async (token: string) => {
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
    return userInfo;
  } catch (err) {
    if (err instanceof Error) {
      Toast.show(err.message);
    }
    Sentry.Native.captureException(err);
  }
};
