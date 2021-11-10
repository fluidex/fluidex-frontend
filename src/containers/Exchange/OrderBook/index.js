import { Select } from "@/components";
import { trans } from "@/i18n";
import * as utils from "@/utils";
import cn from "classnames";
import { Empty } from "components";
import isNumber from "lodash/isNumber";
import sortBy from "lodash/sortBy";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import styles from "./orderBook.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_ORDER_BOOK", lang, ...args);

// For a height of 485px.
const MAX_ENTRIES_PER_SIDE = 9;
const HIGHEST_PRECISION = 0.01;
const NUM_PRECISION_OPTIONS = 6;

const FETCH_INTERVAL = 3000;

const normalizePrice = (price, precision) => {
  const numericPrice = Number(price);

  if (precision >= 1) {
    return numericPrice;
  }

  return numericPrice.toFixed(-Math.log10(precision));
};

const OrderBook = ({
  coinPair,
  pairs,
  lang,
  ticker,
  onClick,
  orderBook,
  getOrderBook,
  orders,
}) => {
  const changeStyle =
    ticker &&
    ticker.price_change_percent &&
    (/^\-/.test(ticker.price_change_percent) ? styles.red : styles.blue);

  const handleClick = (event) => {
    const price = event.currentTarget.dataset.price;
    onClick(+price);
  };

  const normalizeNumByMarket = (num, idx) =>
    utils.normalizeNumByMarket(num, coinPair.id, idx, pairs);

  const pricePrecision = pairs.find(
    (item) => item.name === coinPair.id
  ).price_precision;

  const basePrecision = isNumber(pricePrecision)
    ? 1 / Math.pow(10, pricePrecision)
    : HIGHEST_PRECISION;

  const [precision, setPrecision] = useState(basePrecision);

  const precisionOptions = [];
  for (let i = 0; i < NUM_PRECISION_OPTIONS; i++) {
    precisionOptions.push(basePrecision * Math.pow(10, i));
  }

  const fetch = () => {
    getOrderBook({
      market: coinPair.id,
      interval: precision,
      limit: MAX_ENTRIES_PER_SIDE,
    });
  };

  const currentFetch = useRef();

  const addOrderMark = (side, list) => {
    const listTemp = JSON.parse(JSON.stringify(list));
    let ordersTemp = [];
    let listIndex = 0;
    if (side === "buy") {
      let buyerOrders = orders
        .filter((order) => order.order_side === "BID")
        .map((item) => +item.price);
      buyerOrders = sortBy(buyerOrders, (item) => -item);
      ordersTemp = [...new Set(buyerOrders)];
      for (let index = 0; index < ordersTemp.length; index++) {
        let orderPrice = ordersTemp[index];
        for (; listIndex < listTemp.length; listIndex++) {
          if (orderPrice >= listTemp[listIndex].price) {
            listTemp[listIndex].active = true;
            break;
          }
        }
        if (listIndex === list.length) {
          break;
        }
      }
    } else {
      let sellerOrders = orders
        .filter((order) => order.order_side === "ASK")
        .map((item) => +item.price);
      sellerOrders = sortBy(sellerOrders, (item) => item);
      ordersTemp = [...new Set(sellerOrders)];
      for (let index = 0; index < ordersTemp.length; index++) {
        let orderPrice = ordersTemp[index];
        for (; listIndex < listTemp.length; listIndex++) {
          if (orderPrice <= listTemp[listIndex].price) {
            listTemp[listIndex].active = true;
            break;
          }
        }
        if (listIndex === list.length) {
          break;
        }
      }
    }

    return listTemp;
  };

  useEffect(() => {
    currentFetch.current = fetch;
  });

  useEffect(() => {
    const intervalId = setInterval(currentFetch.current, FETCH_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, [coinPair.id, precision]);

  return (
    <React.Fragment>
      <div className={styles.title}>
        {i18n(lang, "TIT")}
        <Select
          value={precision}
          className={styles.precisionSelect}
          onChange={setPrecision}
        >
          {precisionOptions.map((precision) => (
            <Select.Option key={precision} value={precision}>
              {precision}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={styles.content}>
        <div className={styles.thead}>
          <div className={styles.tr}>
            <div className={styles.th}>
              {i18n(lang, "COL_PRICE")}({coinPair.quoteCoin})
            </div>
            <div className={styles.th}>
              {i18n(lang, "COL_VOLUME")}({coinPair.baseCoin})
            </div>
            <div className={styles.th}>
              {i18n(lang, "COL_TOTAL")}({coinPair.baseCoin})
            </div>
          </div>
        </div>
        <div className={styles.ticker}>
          {ticker ? (
            <div>
              <span className={changeStyle}>
                {normalizeNumByMarket(ticker.last, 0)} {coinPair.quoteCoin}
              </span>
            </div>
          ) : (
            <span>-</span>
          )}
          {ticker ? (
            <span className={changeStyle}>
              {(ticker.price_change_percent * 100).toFixed(2)}%
            </span>
          ) : (
            <span>-</span>
          )}
        </div>
        {["sell", "buy"].map((side, idx) => {
          let list = [];
          if (side === "buy") {
            list = addOrderMark(side, orderBook.bids);
          } else {
            list = addOrderMark(side, orderBook.asks);
          }
          list = list.slice(0, MAX_ENTRIES_PER_SIDE);

          const maxVolume = Math.max(...list.map((item) => +item.amount));

          const sumArray = list.reduce(
            (previousSumArray, currentItem, index) => {
              const lastSum = index === 0 ? 0 : previousSumArray[index - 1];
              previousSumArray.push(Number(currentItem.amount) + lastSum);
              return previousSumArray;
            },
            []
          );
          if (side === "sell") {
            list.reverse();
            sumArray.reverse();
          }

          return (
            <div
              key={side}
              className={cn(styles.table, styles[side])}
              style={{ order: idx + 1 }}
            >
              <div className={styles.tbody}>
                {list.length === 0 && (
                  <Empty size="small" className={styles.emptyIconWrap} />
                )}
                {list.map((item, idx) => (
                  <div
                    data-price={item.price}
                    onClick={handleClick}
                    key={idx}
                    className={cn(
                      styles.tr,
                      side === "buy" ? styles.green : styles.red
                    )}
                  >
                    <div className={styles.td}>
                      {normalizePrice(item.price, precision)}
                      {item.active && (
                        <span
                          className={cn(
                            styles.dot,
                            side === "buy" ? styles.green : styles.red
                          )}
                        ></span>
                      )}
                    </div>
                    <div className={styles.td}>
                      {normalizeNumByMarket(item.amount, 2)}
                    </div>
                    <div className={styles.td}>
                      {normalizeNumByMarket(sumArray[idx], 2)}
                    </div>
                    <div
                      className={styles.line}
                      style={{
                        width: `${(+item.amount / maxVolume) * 100}%`,
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  orderBook: state.markets.orderBook,
  orders: state.orders.orders,
});

const mapDispatchToProps = (dispatch) => ({
  getOrderBook: dispatch.markets.getOrderBook,
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderBook);
