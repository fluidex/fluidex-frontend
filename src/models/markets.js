import { getPair } from "@/utils";
import first from "lodash/first";
import * as apis from "../apis";
const markets = {
  state: {
    favData: {},
    pairs: {
      list: [],
      byIds: {},
    },
    tickers: {},
    orderBook: {
      bids: [],
      asks: [],
    },
    bestPrice: {
      sell: "",
      buy: "",
      market: "",
    },
    depth: {
      asks: [],
      bids: [],
    },
  },
  reducers: {
    setPairs: (state, payload) => {
      const byIds = payload.reduce((obj, item) => {
        obj[item.name] = item;
        return obj;
      }, {});

      return Object.assign({}, state, {
        pairs: {
          list: payload,
          byIds,
        },
      });
    },
    setTickers: (state, payload) => {
      return Object.assign(state, {
        tickers: payload,
      });
    },
    setOrderBook: (state, payload) => {
      return Object.assign(state, {
        orderBook: payload,
      });
    },
    setDepth: (state, payload) => {
      return Object.assign(state, {
        depth: payload,
      });
    },
    setBestPrice: (state, payload) => {
      return Object.assign(state, {
        bestPrice: payload,
      });
    },
    toggleFav(state, payload) {
      const [secCoin, mainCoin] = payload.split("/");

      state.favData[mainCoin] = state.favData[mainCoin] || {};
      const isFav = !!state.favData[mainCoin][secCoin];

      state.favData[mainCoin][secCoin] = isFav ? "" : 1;

      return state;
    },
  },
  effects: {
    async getPairs() {
      const result = await apis.getPairs();
      this.setPairs(result.data.markets);
    },
    async getTickers(coinPair) {
      const result = await apis.getTickerOfMarket(coinPair);
      const r = { [coinPair]: result.data };
      this.setTickers(r);
      return r;
    },
    async getOrderBook({ market, interval, limit = 15 }) {
      const result = await apis.getDepthWithInterval(market, limit, interval);
      if (
        result &&
        result.status === 200 &&
        result.data &&
        result.data.asks &&
        result.data.bids
      ) {
        this.setOrderBook(result.data);
      }
    },
    async getDepth(id, rootState) {
      const prevBestPrice = rootState.markets.bestPrice;
      const marketModified = id !== prevBestPrice.market;

      if (marketModified) {
        console.log("getDepth marketModified:", id, prevBestPrice.market);
        const fieldsToSet = { market: id, buy: "", sell: "" };
        this.setBestPrice(fieldsToSet);
      }

      const limit = 15;
      const result = await apis.getDepth(id, limit);
      this.setDepth(result.data);

      const bestPrice = {
        market: id,
        buy: "",
        sell: "",
      };
      try {
        bestPrice.buy = first(result.data.asks).price;
      } catch (e) {}
      try {
        bestPrice.sell = first(result.data.bids).price;
      } catch (e) {}
      const priceModified =
        bestPrice.buy !== prevBestPrice.buy ||
        bestPrice.sell !== prevBestPrice.sell;
      if (priceModified) {
        this.setBestPrice(bestPrice);
      }

      return result;
    },
  },
  selectors: (slice) => ({
    pairTab: () => {
      return slice((markets) => {
        const items = {
          FAV: [],
          USDT: [],
        };
        markets.pairs.list.forEach((item) => {
          const pair = getPair(item.bid_unit, item.ask_unit);
          const obj = { ...item, pair };

          if (
            markets.favData[pair.quoteCoin] &&
            markets.favData[pair.quoteCoin][pair.baseCoin]
          ) {
            items.FAV.push(obj);
          }

          items[pair.quoteCoin] = items[pair.quoteCoin] || [];
          items[pair.quoteCoin].push(obj);
        });

        return items;
      });
    },
  }),
};

export default markets;
