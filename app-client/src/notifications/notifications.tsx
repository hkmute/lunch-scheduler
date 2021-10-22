import * as Notifications from "expo-notifications";
import { AndroidNotificationPriority } from "expo-notifications";

export const initNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      priority: AndroidNotificationPriority.HIGH,
    }),
  });
  scheduleNotifications();
};

const scheduleNotifications = () => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "可以投票lunch食乜了",
      body: "立即投票",
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Lunch結果出來了",
      body: "立即查看",
    },
    trigger: {
      hour: 12,
      minute: 0,
      repeats: true,
    },
  });
};
