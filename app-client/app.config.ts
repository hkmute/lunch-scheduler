import dotenv from "dotenv";
dotenv.config();

export default {
  expo: {
    name: "Lunch Scheduler",
    slug: "lunch-scheduler",
    version: process.env.APP_VERSION,
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: ["sentry-expo"],
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      bundleIdentifier: "com.hkmute.lunchscheduler",
      supportsTablet: true,
    },
    android: {
      package: "com.hkmute.lunchscheduler",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "your sentry organization's short name here",
            project: "your sentry project's name here",
            authToken: "your auth token here",
          },
        },
      ],
    },
  },
};
