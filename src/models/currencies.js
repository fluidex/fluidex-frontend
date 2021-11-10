import * as apis from "../apis";

const currencies = {
  state: [],
  reducers: {
    setAll: (state, payload) => {
      return payload;
    },
  },
  effects: (dispatch) => ({
    async getAll(payload, rootState) {
      const result = await apis.getCurrencies();
      //console.log('balance result', result)
      dispatch.currencies.setAll(result.data.asset_lists); // alias: this.setAll(data)
    },
  }),
  selectors: (slice, createSelector, hasProps) => ({
    findBySymbol: hasProps((models, symbol) => {
      return slice((currencies) =>
        currencies.find((item) => item.symbol === symbol)
      );
    }),
    findById: hasProps((models, id) => {
      return slice((currencies) =>
        currencies.find((item) => item.inner_id === id)
      );
    }),
    bySymbols: () => {
      return slice((currencies) =>
        currencies.reduce((obj, item) => {
          obj[item.symbol] = item;
          return obj;
        }, {})
      );
    },
  }),
};

export default currencies;
