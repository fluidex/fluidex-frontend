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
    async getAll({ coinPairId, config }) {
      const result = await apis.getMyOpenOrders({ coinPairId, config });
      this.setAll(result.data);
    },
  },
};

export default orders;
