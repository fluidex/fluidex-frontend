import React, { Component } from "react";
import { trans } from "../i18n";
import Modal from "../Modal";
import style from "./style.module.less";

const i18n = (lang, ...args) => trans("TRANSFER", lang, ...args);

export default class Trade extends Component {
  static defaultProps = {
    to: "exchange",
    exchangeAmount: 0,
    symbol: "ETH",
    lang: "en",
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      to: props.to,
      amount: "",
    };
  }

  onChooseAll = () => {
    const { exchangeAmount } = this.props;
    this.setState({
      amount: exchangeAmount,
    });
  };

  onTradeChange = () => {
    this.setState({
      to: "exchange",
      amount: "",
    });
  };

  onAmountChange = (e) => {
    const value = e.target.value;
    const { exchangeAmount } = this.props;
    const reg = new RegExp(/((^[1-9]\d*)|^0)(\.\d{0,8}){0,1}$/);
    if (reg.test(value) || value === "") {
      const max = exchangeAmount;
      const amount = Number(value);
      if (amount <= max) {
        this.setState({
          amount: value,
        });
      }
    }
  };

  onSubmit = () => {
    const { to, amount } = this.state;
    const value = Number(amount);
    // if(value > max){
    //   // Determine whether it exceeds the available
    //   return;
    // }
    this.props.onSubmit(to, value);
  };

  render() {
    const { to, amount } = this.state;
    const { exchangeAmount, symbol, lang } = this.props;
    let btns = [
      <div className={style["btn-box"]}>
        <button>{i18n(lang, "EXCHANGE_ACCOUNT")}</button>
        <span>
          {i18n(lang, "AVAILABLE")}: {exchangeAmount} {symbol}
        </span>
      </div>,
      <i className={style["icon-exchange"]} onClick={this.onTradeChange}></i>,
    ];
    if (to === "exchange") {
      btns = btns.reverse();
    }
    return (
      <div className={style["container"]}>
        <div className={style["btns"]}>
          {btns.map((child, idx) => React.cloneElement(child, { key: idx }))}
        </div>
        <div className={style["amount-box"]}>
          <span>{i18n(lang, "AMOUNT")}</span>
          <div className={style["input-box"]}>
            <input type="text" value={amount} onChange={this.onAmountChange} />
            <span onClick={this.onChooseAll}>{i18n(lang, "ALL")}</span>
          </div>
          <span>{symbol}</span>
        </div>
        <button
          className={style["confirm"]}
          onClick={this.onSubmit}
          disabled={Number(amount) === 0}
        >
          {i18n(lang, "CONFIRM")}
        </button>
      </div>
    );
  }
}

const TradeModal = (props) => {
  return (
    <Modal
      title="Asset Transfer"
      DialogClass={style["trade-container"]}
      className={style["trade-box"]}
      {...props}
    >
      <Trade {...props} />
    </Modal>
  );
};

Trade.Modal = TradeModal;
