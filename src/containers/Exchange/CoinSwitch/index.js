import { trans } from "@/i18n";
import { select } from "@/old_store";
import * as utils from "@/utils";
import cn from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./coinSwitch.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_COIN_SWITCH", lang, ...args);

class CoinSwitch extends Component {
  state = {
    activeTab: "FAV",
    searchKeyword: "",
  };

  onTabSwitch = (event) => {
    const tab = event.currentTarget.dataset.tab;

    this.setState({ activeTab: tab });
  };

  switchHandler = (event) => {
    const { key } = event.currentTarget.dataset;

    this.props.history.replace(`/trade/${key}`);
  };

  toggleFav = (event) => {
    event.stopPropagation();
    const { pair } = event.currentTarget.dataset;

    this.props.toggleFav(pair);
  };

  handleInputChange = (event) => {
    const value = event.currentTarget.value;

    this.setState({ searchKeyword: value.replace(/[^\w\d]/g, "") });
  };

  resetSearchKeyword = () => {
    this.setState({ searchKeyword: "" });
  };

  componentDidMount() {
    this.initialized = true;
    this.setState({
      activeTab: this.props.coinPair.quoteCoin,
    });
  }

  render() {
    const { activeTab, searchKeyword } = this.state;
    const { pairs, markets, coinPair, lang } = this.props;
    const { favData, tickers } = markets;
    const coins = Object.keys(pairs);
    let list = pairs[activeTab] || [];

    if (searchKeyword) {
      list = list.filter((item) => {
        return new RegExp(searchKeyword, "ig").test(item.ask_unit);
      });
    }

    return (
      <React.Fragment>
        <div className={styles.head}>
          <div className={styles.tabs}>
            <span
              data-tab="FAV"
              className={cn(
                styles.tab,
                styles.fav,
                activeTab === "FAV" && styles.active
              )}
              onClick={this.onTabSwitch}
            >
              <i className={cn("iconfont", styles.favIcon)}>&#xe61a;</i>
            </span>
            {coins.map((coin) =>
              coin === "FAV" ? null : (
                <span
                  key={coin}
                  data-tab={coin}
                  className={cn(
                    styles.tab,
                    activeTab === coin && styles.active
                  )}
                  onClick={this.onTabSwitch}
                >
                  {coin}
                </span>
              )
            )}
          </div>
          <div className={styles.inputBox}>
            <input
              className={styles.input}
              type="text"
              placeholder={i18n(lang, "SEARCH_PLACEHOLDER")}
              onChange={this.handleInputChange}
              value={this.state.searchKeyword}
              maxLength="9"
            />
            <i className={cn("iconfont", styles.searchIcon)}>&#xe6cc;</i>
            <i
              onClick={this.resetSearchKeyword}
              className={cn(
                "iconfont",
                styles.clearIcon,
                searchKeyword && styles.active
              )}
            >
              &#xe603;
            </i>
          </div>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>
                  <span>{i18n(lang, "COL_PAIR")}</span>
                </th>
                <th>{i18n(lang, "COL_PRICE")}</th>
                <th>{i18n(lang, "COL_CHANGE")}</th>
              </tr>
            </thead>
            <tbody>
              {list.map(({ pair: item }) => {
                const ticker =
                  (tickers[item.id] && tickers[item.id].ticker) || {};
                const colorStyle = /^\+/.test(ticker.price_change_percent)
                  ? styles.green
                  : styles.red;

                return (
                  <tr
                    className={cn(
                      coinPair.symbol === item.symbol && styles.active
                    )}
                    key={item.arr.join("_")}
                    data-key={item.arr.join("_")}
                    onClick={this.switchHandler}
                  >
                    <td>
                      <i
                        onClick={this.toggleFav}
                        data-pair={item.symbol}
                        className={cn(
                          "iconfont",
                          styles.favIcon,
                          favData[item.main] &&
                            favData[item.main][item.second] &&
                            styles.active
                        )}
                      >
                        &#xe61a;
                      </i>
                      {activeTab === "FAV" ? item.symbol : item.second}
                    </td>
                    <td>
                      {ticker.last
                        ? utils.normalizeNumByMarket(ticker.last, item.id, 0)
                        : "-"}
                    </td>
                    <td>
                      <span className={cn(colorStyle)}>
                        {ticker.price_change_percent || "-"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {
            // list.length === 0 && (
            //   <Empty size="small" style={{margin: '-40px 0'}} />
            // )
          }
        </div>
      </React.Fragment>
    );
  }
}

const selection = select((models) => {
  return {
    pairs: models.markets.pairTab,
  };
});

const mapState = (state) => ({
  loading: state.loading.effects.markets.getTickers,
  markets: state.markets,
  ...selection(state),
});

const mapDispatch = (dispatch) => ({
  toggleFav: dispatch.markets.toggleFav,
});

export default connect(mapState, mapDispatch)(withRouter(CoinSwitch));
