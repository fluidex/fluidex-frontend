/* eslint-disabled */
import store from "@/old_store";
import axios from "axios";

const api = axios.create({
  baseURL: window.API_PREFIX,
  responseType: "json",
});

export default api;

export const getPairs = (params) => api.get(`/api/exchange/action/markets`);
export const getBalances = (params) =>
  api.get(`/api/exchange/action/balances/${store.getState().user.id}`);
export const getCurrencies = (params) => api.get(`/api/exchange/action/assets`);
export const getMyOpenOrders = ({ coinPairId, config }) =>
  api.get(
    `/api/exchange/action/orders/${coinPairId}/${store.getState().user.id}`,
    config
  );
export const getDepth = (id, limit) =>
  api.get(`/api/exchange/action/depth/${id}/${limit}`);
export const getDepthWithInterval = (market, limit, interval) =>
  api.get(`/api/exchange/action/depth/${market}/${limit}?interval=${interval}`);
export const createOrder = (data) =>
  api.post(`/api/exchange/action/order`, {
    ...data,
    user_id: store.getState().user.id,
  });

export const cancelOrder = ({ id, market }) =>
  api.post(
    `/api/exchange/action/cancelorder/${market}/${
      store.getState().user.id
    }/${id}`
  );
export const cancelOrders = ({ market }) =>
  api.post(
    `/api/exchange/action/cancelorders/${market}/${store.getState().user.id}`
  );
export const updateBalance = ({ asset, delta }) =>
  api.post(`/api/exchange/action/updatebalance/`, {
    user_id: store.getState().user.id,
    asset,
    delta,
    business_id: Date.now(),
  });
export const registerMocknetUser = ({ address, layer2Address }) =>
  api.post(`/api/exchange/action/registeruser/`, {
    l1_address: address,
    l2_pubkey: layer2Address,
    // TODO: use real user_id
    user_id: 0,
  });
export const getLayer2ExplorerData = (config) => {
  return api.get(`/api/explorer/l2_blocks`, config);
};

export const getTickerOfMarket = (coinPairId) =>
  api.get(`/api/exchange/panel/ticker_24h/${coinPairId}`);
export const getTrades = (id, config) =>
  api.get(`/api/exchange/panel/recenttrades/${id}`, config);
export const getMyClosedOrders = ({ coinPairId, config }) =>
  api.get(
    `/api/exchange/panel/closedorders/${coinPairId}/${
      store.getState().user.id
    }`,
    config
  );
export const getMyOrderDetails = ({ coinPairId, id }) =>
  api.get(`/api/exchange/panel/ordertrades/${coinPairId}/${id}`);
export const getUserDetails = (idOrAddress) =>
  api.get(`/api/exchange/panel/user/${idOrAddress}`);
export const getInternalTransactions = () =>
  api.get(`/api/exchange/panel/internal_txs/${store.getState().user.id}`);

// deprecated api
export const getNotices = (lang, config) =>
  api.get(`/api/exchange/action/v2/help_center/${lang}/sections.json`, config);
