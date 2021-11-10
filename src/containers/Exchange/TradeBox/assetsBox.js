import { updateBalance } from "@/apis";
import { trans } from "@/i18n";
import { Form } from "antd";
import { Button, Input, Toast } from "components";
import React, { useState } from "react";
import { connect } from "react-redux";
import styles from "./assetsBox.module.scss";
import TokenSelect from "./tokenSelect";

const i18n = (lang, ...args) =>
  trans("EXCHANGE_TRADEBOX_ASSETS_BOX", lang, ...args);

const AssetsBox = ({
  lang,
  currencies,
  checkAuthorizationAndMaybeShowModal,
  hasFluidexContract,
  depositEth,
}) => {
  const [submitType, setSubmitType] = useState("");

  const [form] = Form.useForm();

  const handleFormSubmit = ({ asset, delta }) => {
    if (!checkAuthorizationAndMaybeShowModal()) {
      return;
    }
    if (submitType === "deposit" && asset === "ETH" && hasFluidexContract) {
      depositEth(delta);
    } else {
      updateBalance({
        asset,
        delta: String(delta * (submitType === "deposit" ? 1 : -1)),
      }).catch((error) => {
        Toast.error(error.response.data.message);
      });
    }
  };

  return (
    <>
      <div className={styles.title}>{i18n(lang, "TITLE")}</div>
      <Form
        form={form}
        name="assetsBox"
        onFinish={handleFormSubmit}
        onFinishFailed={checkAuthorizationAndMaybeShowModal}
        className={styles.assetsBoxForm}
      >
        <div className={styles.buttons}>
          <Button
            className={styles.button}
            htmlType="submit"
            onClick={() => setSubmitType("deposit")}
          >
            {i18n(lang, "DEPOSIT")}
          </Button>
          <Button
            className={styles.button}
            htmlType="submit"
            onClick={() => setSubmitType("withdraw")}
          >
            {i18n(lang, "WITHDRAW")}
          </Button>
        </div>
        <div>
          <Form.Item className={styles.formItem}>
            <span className={styles.formTit}>
              {i18n(lang, "CURRENCY_TITLE")}
            </span>
            <label className={styles.inputWrap}>
              <Form.Item
                noStyle
                name="asset"
                validateFirst
                rules={[
                  { required: true, message: i18n(lang, "MISSING_CURRENCY") },
                ]}
              >
                <TokenSelect currencies={currencies} lang={lang} />
              </Form.Item>
            </label>
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <span className={styles.formTit}>{i18n(lang, "AMOUNT_TITLE")}</span>
            <label className={styles.inputWrap}>
              <Form.Item
                noStyle
                name="delta"
                initialValue=""
                validateFirst
                rules={[
                  { required: true, message: i18n(lang, "MISSING_AMOUNT") },
                  {
                    message: i18n(lang, "INVALID_AMOUNT"),
                    type: "number",
                    min: 0,
                  },
                ]}
              >
                <Input numeric block />
              </Form.Item>
              <span className={styles.currency}>
                {form.getFieldValue("asset")}
              </span>
            </label>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

const mapStateToProps = (state) => ({
  currencies: state.currencies,
  hasFluidexContract: state.ethereum.hasFluidexContract,
});

const mapDispatch = (dispatch) => ({
  depositEth: dispatch.ethereum.depositEth,
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
});

export default connect(mapStateToProps, mapDispatch)(AssetsBox);
