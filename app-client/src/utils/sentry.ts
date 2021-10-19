import { SENTRY_DSN } from "@env";
import * as Sentry from "sentry-expo";

export const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true,
  });
};
