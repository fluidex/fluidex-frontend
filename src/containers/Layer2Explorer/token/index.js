import Descriptions from "@/components/Descriptions";
import { trans } from "@/i18n";
import store, { select } from "@/old_store";
import React from "react";
import { connect } from "react-redux";
import styles from "./token.module.scss";
import { withRouter } from "react-router-dom";

const i18n = (lang, ...args) => trans("LAYER_2_EXPLORER_TOKEN", lang, ...args);

const Token = ({ lang, match }) => {
  const getTokenDetail = select.currencies.findById(+match.params.tokenId);
  const token = getTokenDetail(store.getState());
  return (
    <Descriptions
      className={styles.container}
      column={1}
      bordered
      title={i18n(lang, "TOKEN_DETAILS_TITLE")}
    >
      <Descriptions.Item label={i18n(lang, "SYMBOL")}>
        {token.symbol}
      </Descriptions.Item>
      <Descriptions.Item label={i18n(lang, "NAME")}>
        {token.name}
      </Descriptions.Item>
      <Descriptions.Item label={i18n(lang, "CHAIN_ID")}>
        {token.chain_id}
      </Descriptions.Item>
      <Descriptions.Item label={i18n(lang, "TOKEN_ADDRESS")}>
        {token.token_address || "-"}
      </Descriptions.Item>
    </Descriptions>
  );
};

const mapStateToProps = (state) => ({
  lang: state.lang,
});

export default connect(mapStateToProps)(withRouter(Token));
