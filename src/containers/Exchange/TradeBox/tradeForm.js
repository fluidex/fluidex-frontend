import { trans } from "@/i18n";
import * as utils from "@/utils";
import { Form, Slider } from "antd";
import cn from "classnames";
import { Button, Input, Toast } from "components";
import throttle from "lodash/throttle";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./tradeForm.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_TRADEBOX_FORM", lang, ...args);

class TradeForm extends Component {
  formRef = React.createRef();

  state = {
    fetching: false,
    sliderValue: 0,
  };

  handleSubmit = (values) => {
    const {
      bestPrice,
      coinPair,
      orderType,
      side,
      assets,
      lang,
      checkAuthorizationAndMaybeShowModal,
    } = this.props;

    if (!checkAuthorizationAndMaybeShowModal()) {
      return;
    }

    const { setFieldsValue } = this.formRef.current;
    let priceVal = bestPrice;

    if (orderType === "limit") {
      priceVal = values.price || 0;
    }

    this.setState({ fetching: true });
    const available =
      side === "buy"
        ? priceVal > 0
          ? Number(assets.quoteCoinAmount) / priceVal
          : 0
        : Number(assets.baseCoinAmount);
    let amount = values.amount;
    if (amount >= available) {
      amount = available;
    }
    if (side === "buy" && orderType !== "limit" && +amount === 0) {
      return Toast.warning(i18n(lang, "BALANCE_NOT_ENOUGH"));
    }
    const field2set = {
      market: coinPair.id,
      order_type: orderType === "limit" ? 0 : 1,
      order_side: side,
      amount: amount,
      taker_fee: "0",
      maker_fee: "0",
    };
    if (orderType === "limit") {
      field2set.price = values.price;
    }
    console.log("post order", field2set);

    this.props.onSubmit(field2set).finally(() => {
      this.setState({ fetching: false });

      setFieldsValue({ amount: "" });
    });
  };

  handleFinishFailed = ({ errorFields }) => {
    if (!this.props.checkAuthorizationAndMaybeShowModal()) {
      return;
    }

    for (const field of errorFields) {
      field.errors.forEach((message) =>
        Toast.warning(field.name + ": " + message)
      );
    }

    this.formRef.current.scrollToField(errorFields[0].name);
  };

  componentDidUpdate(prevProps) {
    const { resetFields, setFieldsValue } = this.formRef.current;
    if (prevProps.orderType !== this.props.orderType) {
      // setFieldsValue({ amount: '' })
      resetFields(["amount"]);
    }

    if (prevProps.coinPair.id !== this.props.coinPair.id) {
      resetFields();
    }

    if (prevProps.side !== this.props.side) {
      setFieldsValue({ price: this.props.bestPrice });
      resetFields(["amount"]);
    }
  }

  numberValidator = (rule, value, cb) => {
    const val = Number(value);
    if (Number.isNaN(val)) {
      return cb(`Does not need to be of type number`);
    }

    if (val <= 0) {
      return cb("Is not a number greater than 0");
    }

    cb();
  };

  maximumValidator = (maxValue) => (rule, value, cb) => {
    // TODO Temporarily remove
    // if (maxValue && maxValue < Number(value)) {
    //   return cb(`greater than${maxValue}`)
    // }

    cb();
  };

  getMaxAmount = () => {
    const { getFieldValue } = this.formRef.current;
    const { assets, side, orderType } = this.props;
    const priceVal = Number(getFieldValue("price")) || 0;

    let maxAmount = assets.baseCoinAmount;

    if (side === "buy") {
      if (orderType === "limit") {
        maxAmount = priceVal > 0 ? assets.quoteCoinAmount / priceVal : 0;
      } else {
        maxAmount = Infinity;
      }
    }

    return maxAmount;
  };

  handleSliderChange = throttle((val) => {
    const { setFieldsValue } = this.formRef.current;

    const maxAmount = this.getMaxAmount();

    // Use utils.subStringNum to ensure the amount is always smaller or
    // equal to the maximum amount.
    // Number.toFixed rounds the number instead.
    setFieldsValue({
      amount: utils.subStringNum((val / 100) * maxAmount, 4),
    });

    this.setState({ sliderValue: val });
  }, 16.6);

  handleAmountChange = (amount) => {
    const maxAmount = this.getMaxAmount();
    this.setState({ sliderValue: (amount / maxAmount) * 100 });
  };

  render() {
    const { fetching, sliderValue } = this.state;
    let { orderType, coinPair, bestPrice, assets, side, lang } = this.props;

    const sliderMarks = { 0: "", 25: "", 50: "", 75: "", 100: "" };

    let priceVal = 0;
    let amountVal = 0;
    let amountMax = 0;
    if (this.formRef.current) {
      const { getFieldValue } = this.formRef.current;
      priceVal = getFieldValue("price");
      amountVal = getFieldValue("amount");
      amountMax = this.getMaxAmount();
    }

    const total = utils.multiply(priceVal, amountVal);

    return (
      <Form
        onFinish={this.handleSubmit}
        onFinishFailed={this.handleFinishFailed}
        name="tradeForm"
        ref={this.formRef}
      >
        <div className={styles.available}>
          <span>{i18n(lang, "AVAILABLE")} </span>
          <span>
            {side === "buy"
              ? Number(assets.quoteCoinAmount).toFixed(
                  assets.quoteCoinPrecision
                )
              : Number(assets.baseCoinAmount).toFixed(
                  assets.baseCoinPrecision
                )}{" "}
          </span>
          <span>{side === "buy" ? coinPair.quoteCoin : coinPair.baseCoin}</span>
        </div>
        <Form.Item className={styles.formItem} extra={null}>
          <span className={styles.formTit}>
            {side === "buy"
              ? i18n(lang, "BUY_PRICE")
              : i18n(lang, "SELL_PRICE")}
          </span>
          <label className={styles.inputWrap}>
            {orderType === "market" && (
              <div className={cn(styles.input, styles.disable)}>
                {side === "buy"
                  ? i18n(lang, "BUY_AT_BEST_PRICE")
                  : i18n(lang, "SELL_AT_BEST_PRICE")}
              </div>
            )}
            {orderType === "limit" && (
              <Form.Item
                noStyle
                name="price"
                initialValue={bestPrice}
                validateFirst
                rules={[
                  { required: true, message: i18n(lang, "MISSING_PRICE") },
                  {
                    message: i18n(lang, "INVALID_PRICE"),
                    validator: this.numberValidator,
                  },
                  {
                    message: i18n(
                      lang,
                      side === "buy" ? "MAX_BUY_PRICE" : "MAX_SELL_PRICE"
                    ),
                    validator: this.maximumValidator(bestPrice * 1.1),
                  },
                ]}
              >
                <Input block step="any" type="text" />
              </Form.Item>
            )}
            <span className={styles.currency}>{coinPair.quoteCoin}</span>
          </label>
        </Form.Item>
        <Form.Item className={styles.formItem}>
          <span className={styles.formTit}>
            {side === "buy"
              ? orderType === "limit"
                ? i18n(lang, "BUY_VOLUME")
                : i18n(lang, "TRANS_AMOUNT")
              : i18n(lang, "SELL_AMOUNT")}
          </span>
          <label className={styles.inputWrap}>
            <Form.Item
              noStyle
              name="amount"
              initialValue=""
              validateFirst
              rules={[
                { required: true, message: i18n(lang, "MISSING_AMOUNT") },
                {
                  message: i18n(lang, "INVALID_AMOUNT"),
                  validator: this.numberValidator,
                },
                {
                  message: i18n(lang, "MAX_BUY_VOLUME", amountMax),
                  validator: this.maximumValidator(amountMax),
                },
              ]}
            >
              <Input
                block
                step="any"
                type="number"
                onChange={this.handleAmountChange}
              />
            </Form.Item>
            <span className={styles.currency}>{coinPair.baseCoin}</span>
          </label>
        </Form.Item>
        <div className={styles.slider}>
          <Slider
            tipFormatter={(val) => {
              return (
                <span style={{ whiteSpace: "nowrap" }}>{Math.ceil(val)}%</span>
              );
            }}
            value={sliderValue}
            onChange={this.handleSliderChange}
            disabled={side === "buy" && orderType === "market"}
            // min={0}
            // max={amountMax}
            marks={sliderMarks}
          />
        </div>
        {orderType === "limit" ? (
          <div className={styles.total}>
            {i18n(lang, "TOTAL")}{" "}
            {total !== "NaN"
              ? utils.normalizeNumByMarket(total, coinPair.id, 0)
              : 0}
            <span> {coinPair.quoteCoin}</span>
          </div>
        ) : (
          <div className={styles.marketFormPlaceholder} />
        )}
        <Button
          block
          htmlType="submit"
          loading={fetching}
          className={cn(styles.button, styles[side])}
        >
          <span>{i18n(lang, side === "buy" ? "BUY_BTN" : "SELL_BTN")} </span>
          <span style={{ marginLeft: 6 }}>{coinPair.baseCoin}</span>
        </Button>
      </Form>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
});

export default connect(null, mapDispatchToProps)(TradeForm);
