import AsyncStorage from "@react-native-async-storage/async-storage";
import { init } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import loadingPlugin from "@rematch/loading";
import createRematchPersist from "@rematch/persist";
import selectPlugin from "@rematch/select";
import models from "./models";
import subscribe from "./storeSubscribers";

const store = init({
  models,
  plugins: [
    selectPlugin(),
    loadingPlugin(),
    immerPlugin(),
    createRematchPersist({
      whitelist: ["currencies", "markets"],
      throttle: 2000,
      version: 1,
      keyPrefix: "xxxx_",
      debug: true,
      key: "root",
      storage: AsyncStorage,
    }),
  ],
});

subscribe(store);

export const { select } = store;
export default store;
