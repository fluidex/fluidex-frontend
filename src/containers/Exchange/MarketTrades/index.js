import * as apis from "@/apis";
import { trans } from "@/i18n";
import * as utils from "@/utils";
import axios from "axios";
import cn from "classnames";
import { Empty, Spin } from "components";
import React, { Component } from "react";
import styles from "./marketTrades.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_MARKET_TRADE", lang, ...args);
let destroyStatus = false;
const NUMBER_OF_ENTRIES_SHOWN = 17;

class MarketTrades extends Component {
  state = {
    loading: true,
    list: [],
  };

  componentWillUnmount() {
    destroyStatus = true;
    this.abortRequest && this.abortRequest("force abort");
  }

  fetch = (id = this.props.coinPair.id) => {
    if (this.abortRequest) {
      this.abortRequest("abortRequest");
      this.abortRequest = null;
    }
    this.timer && clearTimeout(this.timer);

    apis
      .getTrades(id, {
        cancelToken: new axios.CancelToken((cancel) => {
          this.abortRequest = cancel;
        }),
        params: {
          limit: NUMBER_OF_ENTRIES_SHOWN,
        },
      })
      .then((result) => {
        if (!destroyStatus) {
          this.setState({
            list: result.data,
            loading: false,
          });
        }
      })
      .finally(() => {
        this.abortRequest = null;
        this.timer = setTimeout(this.fetch, 3e3);
      });
  };

  componentDidMount() {
    destroyStatus = false;
    this.fetch(this.props.coinPair.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coinPair.id !== this.props.coinPair.id) {
      this.timer && clearTimeout(this.timer);
      this.setState({ loading: true });
      this.fetch(this.props.coinPair.id);
    }
  }

  render() {
    const { coinPair, lang } = this.props;
    // const maxVolume = Math.max(...this.state.list.map(item => +item.volume))
    const loading = this.state.loading;
    const normalizeNumByMarket = (num, idx) =>
      utils.normalizeNumByMarket(num, coinPair.id, idx);

    return (
      <React.Fragment>
        <div className={styles.title}>{this.props.title}</div>
        <div className={styles.content}>
          <div className={styles.table}>
            <div className={styles.thead}>
              <div className={styles.tr}>
                <div className={styles.th}>{i18n(lang, "COL_TIME")}</div>
                <div className={styles.th}>
                  {i18n(lang, "COL_PRICE")}({coinPair.quoteCoin})
                </div>
                <div className={styles.th}>
                  {i18n(lang, "COL_VOLUME")}({coinPair.baseCoin})
                </div>
              </div>
            </div>
            <Spin loading={loading} style={{ marginTop: 100 }}>
              <div className={styles.tbody}>
                {!this.state.loading && this.state.list.length === 0 && (
                  <Empty size="small" style={{ margin: "32px 0 0" }} />
                )}
                {this.state.list.map((item) => (
                  <div
                    key={item.trade_id}
                    className={cn(
                      styles.tr,
                      item.taker_side === "BID" ? styles.green : styles.red
                    )}
                  >
                    <div className={styles.td}>
                      {utils.dayjsLocal(item.time).format("HH:mm:ss")}
                    </div>
                    <div className={styles.td}>
                      {normalizeNumByMarket(item.price, 0)}
                    </div>
                    <div className={styles.td}>
                      {normalizeNumByMarket(item.amount, 2)}
                    </div>
                    {/* <div className={styles.line} style={{width: `${+item.volume/maxVolume*100}%`}}></div> */}
                  </div>
                ))}
              </div>
            </Spin>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MarketTrades;
