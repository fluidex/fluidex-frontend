import { trans } from "@/i18n";
import * as utils from "@/utils";
import React, { Component } from "react";
import MarketSelect from "./MarketSelect";
import styles from "./ticker.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_TICKER", lang, ...args);

class Ticker extends Component {
  render() {
    const { coinPair, ticker, lang, pairs } = this.props;
    const changeStyle =
      ticker &&
      ticker.price_change_percent &&
      (/^\-/.test(ticker.price_change_percent) ? styles.red : styles.green);
    const normalizeNumByMarket = (num, idx) =>
      utils.normalizeNumByMarket(num, coinPair.id, idx);

    return (
      <React.Fragment>
        <div className={styles.wrap}>
          <div className={styles.marketName}>
            <MarketSelect coinPair={coinPair} pairs={pairs} />
          </div>
          <dl className={styles.item}>
            <dd className={styles.itemCon}>
              {ticker ? (
                <React.Fragment>
                  <div className={changeStyle} style={{ lineHeight: "1.2" }}>
                    {normalizeNumByMarket(ticker.last, 0)} {coinPair.quoteCoin}
                  </div>
                  <div className={styles.gray} style={{ lineHeight: "1.2" }}>
                    {/*
                      <span> ≈ </span>
                      {lang === 'en' ? '$' : '￥'}{normalizeNumByMarket(lang === 'en' ? ticker.usd : ticker.cny, 1)}
*/}
                  </div>
                </React.Fragment>
              ) : (
                <span>-</span>
              )}
            </dd>
          </dl>
          <dl className={styles.item}>
            <dt className={styles.itemTit}>{i18n(lang, "24H_CHANGE")}</dt>
            <dd className={styles.itemCon}>
              {ticker ? (
                <span className={changeStyle}>
                  {(ticker.price_change_percent * 100).toFixed(2)}%
                </span>
              ) : (
                <span>-</span>
              )}
            </dd>
          </dl>
          <dl className={styles.item}>
            <dt className={styles.itemTit}>{i18n(lang, "24H_HEIGHT")}</dt>
            <dd className={styles.itemCon}>
              {ticker ? (
                <span>{normalizeNumByMarket(ticker.high, 0)}</span>
              ) : (
                <span>-</span>
              )}
            </dd>
          </dl>
          <dl className={styles.item}>
            <dt className={styles.itemTit}>{i18n(lang, "24H_LOW")}</dt>
            <dd className={styles.itemCon}>
              {ticker ? (
                <span>{normalizeNumByMarket(ticker.low, 0)}</span>
              ) : (
                <span>-</span>
              )}
            </dd>
          </dl>
          <dl className={styles.item}>
            <dt className={styles.itemTit}>{i18n(lang, "24H_VOLUME")}</dt>
            <dd className={styles.itemCon}>
              {ticker ? (
                <span>
                  {(+ticker.volume).toFixed(2)} {coinPair.baseCoin}
                </span>
              ) : (
                <span>-</span>
              )}
            </dd>
          </dl>
        </div>
      </React.Fragment>
    );
  }
}

export default Ticker;
