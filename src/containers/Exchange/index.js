import { trans } from "@/i18n";
import { select } from "@/old_store";
import { getPair, toNonEXP } from "@/utils";
import cn from "classnames";
import { Spin, Tabs } from "components";
import React, { Component, Suspense } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import ActiveOrders from "./ActiveOrders";
import styles from "./exchange.module.scss";
import MarketTrades from "./MarketTrades";
import OrderBook from "./OrderBook";
import Orders from "./Orders";
import Ticker from "./Ticker";

const TradeBox = React.lazy(() => import("./TradeBox"));
const Chart = React.lazy(() => import("./Chart"));

const i18n = (lang, ...args) => trans("EXCHANGE", lang, ...args);

const ORDERS_TAB_OPEN_ORDERS = "openOrders";
const ORDERS_TAB_ORDER_HISTORY = "orderHistory";

class Exchange extends Component {
  state = {
    err: null,
    activeOrdersTabName: ORDERS_TAB_OPEN_ORDERS,
  };

  saveLastVistMarketId = (id) => {
    localStorage.setItem("fluidex-exchange-lastvisit-mid", id);
  };

  static getLastVistMarketId = () => {
    return localStorage.getItem("fluidex-exchange-lastvisit-mid") || "ETH_USDT";
  };

  componentDidMount() {
    // todo，MatchedPair is not updated when the route is switched
    let { matchedPair, history } = this.props;
    let lastVisitMid =
      matchedPair.id || localStorage.getItem("fluidex-exchange-lastvisit-mid");
    const arr = lastVisitMid.split("_");
    const id = lastVisitMid;
    if (lastVisitMid && arr.length > 0 && matchedPair.id !== id) {
      matchedPair = getPair(arr[0], arr[1]);
    }
    this.saveLastVistMarketId(matchedPair.id);
    // There is no way for the upper layer to capture the route jump, so the route is manually updated to the new currency here
    history.replace(`/exchange/trade/${matchedPair.id}`);
    // if (!pairs.byIds[matchedPair.id]) {
    //   let nextPair
    //   try {
    //     nextPair = getPair(pairs.list[1].ask_unit, pairs.list[1].bid_unit)
    //   } catch(e) {}

    //   if (!nextPair) {
    //     return this.setState({
    //       err: new Error('500')
    //     })
    //   }
    //   return history.replace(`/exchange/trade/${nextPair.arr.join('_')}`)
    // }

    this.fetch();
    // TODO Need to abort the previous request
  }

  prevPair = "";

  stopTimer = () => {
    clearTimeout(this.fetchTimer);
  };

  startTimer = () => {
    this.stopTimer();
    this.fetchTimer = setTimeout(this.fetch, 3 * 1000);
  };

  fetch = () => {
    this.stopTimer();
    const { matchedPair } = this.props;
    const mid = localStorage.getItem("fluidex-exchange-lastvisit-mid");
    const id = !!mid ? mid : matchedPair.id;
    const apis = [this.props.getTickers(id), this.props.getDepth(id)];

    const pairId = id;
    this.prevPair = id;

    return Promise.all(apis).finally(() => {
      if (!this.state.err) {
        if (this.prevPair === pairId) {
          this.startTimer();
        } else {
          console.log("error");
        }
      }
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.matchedPair.id !== this.props.matchedPair.id) {
      this.saveLastVistMarketId(this.props.matchedPair.arr.join("_"));
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  setDefPrice = (val) => {
    this.props.setBestPrice({
      ...this.props.markets.bestPrice,
      ...{
        buy: toNonEXP(val),
        sell: toNonEXP(val),
      },
    });
  };

  handleActiveOrdersTabChange = (tabName) => {
    this.setState({ activeOrdersTabName: tabName });
  };

  render() {
    const { matchedPair, lang, markets, isRegistered } = this.props;
    const {
      bestPrice,
      depth,
      tickers,
      pairs: { list, byIds },
    } = markets;
    const ticker = (tickers[matchedPair.id] && tickers[matchedPair.id]) || null;
    // if (this.state.err) {
    //   return (
    //     <InternelServerError style={{marginBottom: -10}} />
    //   )
    // }

    const title =
      ticker && ticker.last ? `${ticker.last} ${matchedPair.symbol}` : "";
    const suspenseFallback = (
      <div className={styles.suspenseFallback}>
        <Spin hasOverlay={false} className={styles.spin} loading />
      </div>
    );

    return (
      <>
        <Helmet>
          <title>
            {title} {i18n(lang, "SITE_TITLE")} | FluiDex
          </title>
        </Helmet>
        <div className={styles.container}>
          <div className={styles.cols}>
            <div className={cn(styles.col, styles.main)}>
              <div className={cn(styles.box, styles.ticker)}>
                <Ticker
                  ticker={ticker}
                  lang={lang}
                  coinPair={matchedPair}
                  pairs={list}
                />
              </div>

              <div className={styles.cols}>
                <div className={cn(styles.col, styles.main)}>
                  <div className={cn(styles.box, styles.chart)}>
                    <Suspense fallback={suspenseFallback}>
                      <Chart lang={lang} pairs={list} coinPair={matchedPair} />
                    </Suspense>
                  </div>
                  <div className={cn(styles.box, styles.ordersTab)}>
                    <Tabs onChange={this.handleActiveOrdersTabChange}>
                      <Tabs.Tab name={ORDERS_TAB_OPEN_ORDERS}>
                        {i18n(lang, "ACTIVE_ORDER_TIT")}
                      </Tabs.Tab>
                      <Tabs.Tab name={ORDERS_TAB_ORDER_HISTORY}>
                        {i18n(lang, "ALL_ORDER_TIT")}
                      </Tabs.Tab>
                    </Tabs>

                    {this.state.activeOrdersTabName ===
                      ORDERS_TAB_OPEN_ORDERS && (
                      <ActiveOrders
                        lang={lang}
                        isRegistered={isRegistered}
                        title={i18n(lang, "ACTIVE_ORDER_TIT")}
                        coinPair={matchedPair}
                      />
                    )}
                    {this.state.activeOrdersTabName ===
                      ORDERS_TAB_ORDER_HISTORY && (
                      <Orders
                        lang={lang}
                        isRegistered={isRegistered}
                        coinPair={matchedPair}
                        title={i18n(lang, "ALL_ORDER_TIT")}
                      />
                    )}
                  </div>
                </div>

                <div className={cn(styles.col, styles.side)}>
                  <div className={cn(styles.box, styles.orderBook)}>
                    <OrderBook
                      lang={lang}
                      depth={depth}
                      ticker={ticker}
                      pairs={list}
                      onClick={this.setDefPrice}
                      coinPair={matchedPair}
                    />
                  </div>
                  <div className={cn(styles.box, styles.tradeHistory)}>
                    <MarketTrades
                      lang={lang}
                      title={i18n(lang, "MARKET_TRADES_TIT")}
                      coinPair={matchedPair}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={cn(styles.col, styles.side, styles.tradeBoxCol)}>
              <div className={cn(styles.box, styles.tradeBox)}>
                <Suspense fallback={suspenseFallback}>
                  <TradeBox
                    lang={lang}
                    coinPair={matchedPair}
                    marketPair={byIds[matchedPair.id]}
                    bestPrice={bestPrice}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const selection = select((models) => ({
  isRegistered: models.user.isRegistered,
}));

const mapState = (state, props) => {
  const { baseCoin, quoteCoin } = props.match.params;

  return {
    matchedPair: getPair(baseCoin, quoteCoin),
    markets: state.markets,
    lang: state.lang,
    ...selection(state),
  };
};

const mapDispatch = (dispatch) => ({
  getTickers: dispatch.markets.getTickers,
  getDepth: dispatch.markets.getDepth,
  setBestPrice: dispatch.markets.setBestPrice,
});

export default connect(mapState, mapDispatch)(Exchange);
