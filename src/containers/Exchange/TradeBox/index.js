import * as apis from "@/apis";
import { trans } from "@/i18n";
import { select } from "@/old_store";
import { multiply, pow } from "@/utils";
import cn from "classnames";
import { Button, Spin, Tabs, Toast } from "components";
import { Account, OrderInput } from "fluidex.js";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./tradeBox.module.scss";
import TradeForm from "./tradeForm";

const i18n = (lang, ...args) => trans("EXCHANGE_TRADEBOX", lang, ...args);

const SIDE_BUY = "buy";
const SIDE_SELL = "sell";
const ORDER_TYPE_LIMIT = "limit";
const ORDER_TYPE_MARKET = "market";
const ORDER_TYPE_DEFAULT = ORDER_TYPE_LIMIT;

function getAtPrecision(d, p) {
  return multiply(d, pow(10, p));
}

class TradeBox extends Component {
  state = {
    side: SIDE_BUY,
    orderType: ORDER_TYPE_DEFAULT,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const stateModified = nextState !== this.state;
    const pairModified =
      nextProps.coinPair.symbol !== this.props.coinPair.symbol;
    const assetModified =
      nextProps.matchedAssets.quoteCoinAmount !==
        this.props.matchedAssets.quoteCoinAmount ||
      nextProps.matchedAssets.baseCoinAmount !==
        this.props.matchedAssets.baseCoinAmount;
    const bestPriceModified =
      nextProps.bestPrice.buy !== this.props.bestPrice.buy ||
      nextProps.bestPrice.sell !== this.props.bestPrice.sell;
    const langModified = nextProps.lang !== this.props.lang;

    return (
      langModified ||
      stateModified ||
      pairModified ||
      assetModified ||
      bestPriceModified
    );
  }

  handleSideButtonClick = (event) => {
    const side = event.currentTarget.dataset.side;
    if (side !== this.state.side) {
      this.setState({ side, orderType: ORDER_TYPE_DEFAULT });
    }
  };

  handleOrderTypeChange = (orderType) => {
    if (orderType !== this.state.orderType) {
      this.setState({ orderType });
    }
  };

  getSignature = async (formData) => {
    const {
      marketPair,
      currencies,
      layer2Signature,
      refreshLayer2Credentials,
      checkAuthorizationAndMaybeShowModal,
    } = this.props;

    let account = null;

    if (!layer2Signature) {
      const refreshedLayer2Signature = await refreshLayer2Credentials({
        preserveExistingCredentials: true,
      });
      if (!refreshedLayer2Signature) {
        checkAuthorizationAndMaybeShowModal();
        return;
      }

      account = Account.fromSignature(refreshedLayer2Signature);
    } else {
      account = Account.fromSignature(layer2Signature);
    }

    const amountRounded = Number(formData.amount).toFixed(
      marketPair.amount_precision
    );
    const priceRounded = Number(formData.price).toFixed(
      marketPair.price_precision
    );
    const amountFullPrecision = getAtPrecision(
      amountRounded,
      marketPair.amount_precision
    );
    const priceFullPrecision = getAtPrecision(
      priceRounded,
      marketPair.price_precision
    );
    const quoteFullPrecision = multiply(
      amountFullPrecision,
      priceFullPrecision
    );

    const baseTokenInfo = currencies.find(
      (asset) => asset.symbol === marketPair.base
    );
    const quoteTokenInfo = currencies.find(
      (asset) => asset.symbol === marketPair.quote
    );

    let tokenBuy, tokenSell, totalSell, totalBuy;

    if (formData.order_side === SIDE_BUY) {
      tokenBuy = baseTokenInfo.inner_id;
      tokenSell = quoteTokenInfo.inner_id;
      totalBuy = amountFullPrecision;
      totalSell = quoteFullPrecision;
    } else {
      tokenSell = baseTokenInfo.inner_id;
      tokenBuy = quoteTokenInfo.inner_id;
      totalSell = amountFullPrecision;
      totalBuy = quoteFullPrecision;
    }
    const orderInput = new OrderInput({
      tokenSell,
      tokenBuy,
      totalSell,
      totalBuy,
    });

    return account.signHashPacked(orderInput.hash());
  };

  handleSubmit = async (data) => {
    const signature = await this.getSignature(data);

    if (!signature) {
      Toast.error(i18n(this.props.lang, "CREATE_SIGNATURE_FAILED"));
      return;
    }

    const orderData = {
      ...data,
      signature,
    };

    orderData.order_side = orderData.order_side === "sell" ? 0 : 1;

    return apis
      .createOrder(orderData)
      .then(() => {
        this.props.fetchOrders();
        this.props.getAssets();
        Toast.success(i18n(this.props.lang, "CREATE_SUCCESS"));
      })
      .catch((err) => {
        Toast.error(i18n(this.props.lang, "CREATE_FAILD"));
      });
  };

  render() {
    const { lang, coinPair, matchedAssets, bestPrice } = this.props;
    const { side, orderType } = this.state;

    return (
      <React.Fragment>
        <Spin loading={false}>
          <div className={styles.sideButtonGroup}>
            <Button.Group>
              <Button
                data-side={SIDE_BUY}
                className={cn(
                  styles.sideButton,
                  styles.sideBuyButton,
                  side === SIDE_BUY && styles.active
                )}
                onClick={this.handleSideButtonClick}
              >
                {i18n(lang, "BUY_BTN")}
              </Button>
              <Button
                data-side={SIDE_SELL}
                className={cn(
                  styles.sideButton,
                  styles.sideSellButton,
                  side === SIDE_SELL && styles.active
                )}
                onClick={this.handleSideButtonClick}
              >
                {i18n(lang, "SELL_BTN")}
              </Button>
            </Button.Group>
          </div>

          <Tabs active={orderType} onChange={this.handleOrderTypeChange}>
            <Tabs.Tab name={ORDER_TYPE_LIMIT}>
              {i18n(lang, "TAB_LIMIT")}
            </Tabs.Tab>
            <Tabs.Tab name={ORDER_TYPE_MARKET} disabled>
              {i18n(lang, "TAB_MARKET")}
            </Tabs.Tab>
          </Tabs>

          <div className={styles.content}>
            <div className={cn(styles.panel, styles[side])}>
              <TradeForm
                lang={lang}
                side={side}
                orderType={orderType}
                coinPair={coinPair}
                bestPrice={bestPrice[side]}
                assets={matchedAssets}
                onSubmit={this.handleSubmit}
              />
            </div>
          </div>

          {/* Hidden as directed by FLDX-140. */}
          {/* <AssetsBox lang={lang} /> */}
        </Spin>
      </React.Fragment>
    );
  }
}

const selection = select((models) => {
  return { currencies: models.currencies.bySymbols };
});

const mapStateToProps = (state, { coinPair }) => {
  const matchedAssets = {
    baseCoinAmount: 0,
    baseCoinPrecision: 0,
    quoteCoinAmount: 0,
    quoteCoinPrecision: 0,
  };

  const { currencies } = selection(state);

  state.assets.balances.forEach((item) => {
    const coin = item.asset_id.toUpperCase();
    if (coin === coinPair.baseCoin) {
      matchedAssets.baseCoinAmount = +item.available;
      matchedAssets.baseCoinPrecision = currencies[coin].precision;
    } else if (coin === coinPair.quoteCoin) {
      matchedAssets.quoteCoinAmount = +item.available;
      matchedAssets.quoteCoinPrecision = currencies[coin].precision;
    }
  });

  return {
    matchedAssets,
    currencies: state.currencies,
    layer2Signature: state.ethereum.layer2Signature,
  };
};

const mapDispatchToProps = (dispatch, { coinPair }) => ({
  fetchOrders: () => dispatch.orders.getAll({ coinPairId: coinPair.id }),
  getAssets: dispatch.assets.getAll,
  refreshLayer2Credentials: dispatch.ethereum.refreshLayer2Credentials,
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeBox);
