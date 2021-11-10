import * as apis from "../apis";
const histories = {
  state: {
    withdraw: {
      fetched: false,
      loading: true,
      list: [],
    },
    deposit: {
      fetched: false,
      loading: true,
      list: [],
    },
  },
  reducers: {
    setAll: (state, payload) => {
      state[payload.type].list = payload.result;
      return state;
    },
    toggleLoading: (state, payload) => {
      state[payload.type].loading = payload.loading;
      return state;
    },
  },
  effects: {
    async getAll(type) {
      const result =
        type === "withdraw"
          ? await apis.getWithdrawHistores()
          : await apis.getDepositHistores();

      this.toggleLoading({ type, loading: false });
      this.setAll({ type, result: result.data });
    },
  },
  selectors: (slice, createSelector, hasProps) => ({
    // findById: hasProps((models, id) => {
    //   return slice(currencies => currencies.find(item => item.id === id))
    // }),
    // byIds: () => {
    //   return slice(currencies => currencies.reduce((obj, item) => {
    //     obj[item.id] = item
    //     return obj
    //   }, {}))
    // }
  }),
};

export default histories;
