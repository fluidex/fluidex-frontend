import { trans } from "@/i18n";
import cn from "classnames";
import { Table2 } from "components";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import styles from "./assets.module.scss";
const i18n = (lang, ...args) => trans("ASSETS", lang, ...args);
class Assets extends Component {
  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer = () => {
    this.props.getBalance();
    this.fetchTimer = setTimeout(this.startTimer, 3 * 1000);
  };

  stopTimer = () => {
    clearTimeout(this.fetchTimer);
  };

  getTotal = (data) => {
    let number = 0;
    data.map((item) => (number += +this.calculatePrice(item)));
    return number.toFixed(2);
  };

  calculatePrice = (coin) => {
    const { tickersAssets, pairs } = this.props;
    const key = `${coin.asset_id}_USDT`;
    let available = Number(coin.available);
    let frozen = Number(coin.frozen);
    let last =
      (tickersAssets && tickersAssets[key] && tickersAssets[key].last) || 0;
    if (coin.asset_id === "USDT") {
      last = 1;
    }
    let precision = pairs.byIds[key] ? pairs.byIds[key].price_precision : 2;
    return ((available + frozen) * last).toFixed(precision);
  };

  calculateAmount = (coin) => {
    const { currencies } = this.props;
    let currency = currencies.find((item) => item.symbol === coin.asset_id);
    let available = Number(coin.available);
    let frozen = Number(coin.frozen);
    return (available + frozen).toFixed(currency.precision);
  };

  render() {
    const { tickersAssets, lang, balances } = this.props;
    const columns = [
      {
        key: "asset_id",
        title: i18n(lang, "ASSET_COIN"),
        dataIndex: "asset_id",
        render: (val) => {
          return `${val.toUpperCase()} `;
        },
      },
      {
        key: "amount",
        title: i18n(lang, "ASSET_AMOUNT"),
        dataIndex: "amount",
        render: (val, item) => {
          return <span>{this.calculateAmount(item)}</span>;
        },
      },
      {
        key: "total",
        title: i18n(lang, "ASSET_TOTAL (USD)"),
        dataIndex: "total",
        render: (val, item) => {
          let total = this.calculatePrice(item);
          return <span>{total}</span>;
        },
      },
    ];

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{i18n(lang, "SITE_TITLE")} | FluiDex</title>
          <script src="//recaptcha.net/recaptcha/api.js?onload=onloadCallback&render=explicit" />
          <script src="https://ssl.captcha.qq.com/TCaptcha.js" />
        </Helmet>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <h1 className={styles.title}>{i18n(lang, "TIT")}</h1>
          <div className={styles.tabs}>
            <span className={cn(styles.tab, styles.active)}>
              {i18n(lang, "EXCHANGE_ASSETS")}
            </span>
          </div>
        </div>
        <div className={styles.totalValue}>
          {i18n(lang, "ASSET_TOTAL")}: {this.getTotal(balances, tickersAssets)}{" "}
          USD{" "}
        </div>
        <Table2
          rowKey="id"
          // loading={loading}
          dataSource={balances}
          columns={columns}
          onChange={() => {}}
          classNames={{ wrap: styles.wrap, thead: styles.thead }}
          // expandedRowRender={this.setExpend}
          onRowKey={(item) => item.currency}
          pagination={{ total: 0, current: 1, limit: 0 }}
        />
      </div>
    );
  }
}

const mapDispatch = (dispatch) => ({
  getBalance: dispatch.assets.getAllTickers,
});

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
    auth: state.auth,
    balances: state.assets.balances,
    tickersAssets: state.assets.tickersAssets,
    loading: state.assets.loading,
    currencies: state.currencies,
    pairs: state.markets.pairs,
  };
};
export default connect(mapStateToProps, mapDispatch)(Assets);
