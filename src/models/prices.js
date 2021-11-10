import * as apis from "../apis";
const prices = {
  state: {
    favData: {
      BTC: {
        USD: 1,
      },
    },
    data: [],
  },
  reducers: {
    setAll: (state, payload) => {
      return Object.assign({}, state, payload);
    },
    setFavData: (state, payload) => {
      state.favData = payload;

      return state;
    },
  },
  effects: {
    async getAll(payload, rootState) {
      const result = await apis.getPrices();

      this.setAll(result.data);
    },
    toggleFav(payload, rootState) {
      const [mainCoin, secCoin] = payload.split(",");
      const favData = Object.assign({}, rootState.prices.favData);

      favData[mainCoin] = favData[mainCoin] || {};
      const isFav = !!favData[mainCoin][secCoin];

      favData[mainCoin][secCoin] = isFav ? "" : 1;

      this.setFavData(favData);
    },
  },
  selectors: (slice, createSelector, hasProps) => ({
    findById: hasProps((models, id) => {
      return slice((prices) => prices.data.find((item) => item.symbol === id));
    }),
    byIds: () => {
      return slice((prices) =>
        prices.data.reduce((obj, item) => {
          obj[item.symbol] = item;
          return obj;
        }, {})
      );
    },
    getQuotes: () => {
      return slice((prices) => {
        const items = {
          FAV: [],
          USDT: [],
        };
        prices.data.forEach((item) => {
          const queotes = Object.keys(item.quote);
          const itemList = queotes.reduce((list, symbol) => {
            const obj = {
              ...item.quote[symbol],
              from: item.symbol,
              symbol,
            };

            if (
              prices.favData[item.symbol] &&
              prices.favData[item.symbol][symbol]
            ) {
              items.FAV.push(obj);
            }

            return symbol === item.symbol ? list : list.concat([obj]);
          }, []);

          items[item.symbol] = items[item.symbol] || [];
          items[item.symbol] = items[item.symbol].concat(itemList);
        });

        return items;
      });
    },
  }),
};

export default prices;
