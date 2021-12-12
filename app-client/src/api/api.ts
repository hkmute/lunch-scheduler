import { API_BASE_URL } from "@env";
import * as Sentry from "sentry-expo";
import { OptionListDetails } from "../screens/SettingScreen";
import Toast from "react-native-root-toast";
import * as SecureStore from "expo-secure-store";

export const fetchTodayResult = async (code: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/history/${code}/today`);
    if (res.ok) {
      return await res.json();
    }
    throw new Error((await res.json()).message);
  } catch (err) {
    if (err instanceof Error) {
      Toast.show(err.message);
    }
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
    if (err instanceof Error) {
      Toast.show(err.message);
    }
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
    if (err instanceof Error) {
      Toast.show(err.message);
    }
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
    if (err instanceof Error) {
      Toast.show(err.message);
    }
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
    if (err instanceof Error) {
      Toast.show(err.message);
    }
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
    if (err instanceof Error) {
      Toast.show(err.message);
    }
    Sentry.Native.captureException(err);
  }
};

export const deleteOption = async (
  optionListId: number,
  optionInListId: number
) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const res = await fetch(`${API_BASE_URL}/option-in-list`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optionListId,
        optionInListId,
      }),
    });
    if (!res.ok) {
      throw new Error((await res.json()).message);
    }
    return true;
  } catch (err) {
    if (err instanceof Error) {
      Toast.show(err.message);
    }
    Sentry.Native.captureException(err);
  }
};

export const addOption = async (optionsListId: number, optionName: string) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const res = await fetch(`${API_BASE_URL}/option-in-list`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        optionsListId,
        newOption: optionName,
      }),
    });
    if (!res.ok) {
      throw new Error((await res.json()).message);
    }
    return true;
  } catch (err) {
    if (err instanceof Error) {
      Toast.show(err.message);
    }
    Sentry.Native.captureException(err);
  }
};
