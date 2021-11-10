import App from "containers/App";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./old_store";
import "./theme/common.scss";

if (process.env.NODE_ENV === "production") {
  console.log("BUILD TIME:", process.env.BUILD_TIME);
}

// Initialise ethereum connection and subscriptions.
store.dispatch.ethereum.checkEnvironmentHasMetaMask();
store.dispatch.ethereum.initialiseEthereum();

ReactDOM.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <App />
    {/* </PersistGate> */}
  </Provider>,
  document.getElementById("root")
);
