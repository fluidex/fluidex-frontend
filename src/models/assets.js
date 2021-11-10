import * as apis from "../apis";

const assets = {
  state: {
    balances: [],
    tickersAssets: {},
    loading: true,
  },
  reducers: {
    setAll: (state, payload) => {
      state[payload.type] = payload.result;
      return state;
    },
    setTickers: (state, payload) => {
      state["tickersAssets"][payload.type] = payload.result;
      return state;
    },
  },
  effects: (dispatch) => ({
    async getAll(payload, rootState) {
      const { data } = await apis.getBalances();
      this.setAll({ type: "balances", result: data.balances });
    },
    async getAllTickers() {
      this.setAll({ type: "loading", result: true });
      const { data } = await apis.getBalances();
      if (data.balances) {
        data.balances.map((item) => {
          const assetId = item["asset_id"];
          if (assetId !== "USDT") {
            dispatch.assets.getTickers(`${assetId}_USDT`);
          }
          return assetId;
        });
      }
      this.setAll({ type: "balances", result: data.balances });
      this.setAll({ type: "loading", result: false });
    },
    async getTickers(coinPair) {
      const result = await apis.getTickerOfMarket(coinPair);
      if (result.status === 200) {
        this.setTickers({
          type: coinPair,
          result: result.data,
        });
      }
    },
  }),
};

export default assets;
