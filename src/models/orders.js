import * as apis from "../apis";
const orders = {
  state: {
    orders: [],
    count: 0,
    total: 0,
  },
  reducers: {
    setAll: (state, payload) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    async getAll({ coinPairId, config, cb }) {
      const result = await apis.getMyOpenOrders({ coinPairId, config });
      this.setAll(result.data);
      cb && cb();
    },
  },
};

export default orders;
