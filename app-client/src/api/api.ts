import { API_BASE_URL } from "@env";
import * as Sentry from "sentry-expo";
import { OptionListDetails } from "../screens/SettingScreen";
import * as SecureStore from "expo-secure-store";

export const fetchTodayResult = async (code: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/history/${code}/today`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error((await res.json()).message);
  } catch (err) {
    console.log(err);
    Sentry.Native.captureException(err);
  }
};

export const fetchTodayOptions = async (code: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/today-options/${code}`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error((await res.json()).message);
  } catch (err) {
    console.log(err);
    Sentry.Native.captureException(err);
  }
};

export const fetchTodayVote = async (code: string, user: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/votes/${code}?user=${user}`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error((await res.json()).message);
  } catch (err) {
    console.log(err);
    Sentry.Native.captureException(err);
  }
};

export const postTodayVote = async (id: number, code: string, user: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/votes/${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        optionId: id,
      }),
    });
    if (res.ok) {
      return true;
    }
    throw new Error((await res.json()).message);
  } catch (err) {
    console.log(err);
    Sentry.Native.captureException(err);
  }
};

export const fetchHistory = async (code: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/history/${code}`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error((await res.json()).message);
  } catch (err) {
    console.log(err);
    Sentry.Native.captureException(err);
  }
};

export const fetchOptionListDetails: (code: string) => Promise<{
  data: OptionListDetails;
}> = async (code) => {
  try {
    const res = await fetch(`${API_BASE_URL}/option-list/${code}/details`);
    return await res.json();
  } catch (err) {
    console.log(err);
    Sentry.Native.captureException(err);
  }
};

export const fetchGoogleLogin = async (authCode: string) => {
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
    return userInfo;
  } catch (err) {
    Sentry.Native.captureException(err);
    console.log(err);
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
    console.log(err);
    Sentry.Native.captureException(err);
  }
};
