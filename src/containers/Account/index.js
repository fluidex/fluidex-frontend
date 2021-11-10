import React from "react";
import { connect } from "react-redux";
import { select } from "@/old_store";
import styles from "./account.module.scss";
import Descriptions from "@/components/Descriptions";
import { trans } from "@/i18n";

const i18n = (lang, ...args) => trans("ACCOUNT", lang, ...args);

const Account = ({ lang, user }) => {
  return (
    <Descriptions
      className={styles.container}
      column={1}
      bordered
      title={i18n(lang, "ACCOUNT_DETAILS_TITLE")}
    >
      <Descriptions.Item label={i18n(lang, "ACCOUNT_ID_LABEL")}>
        {user.id}
      </Descriptions.Item>
      <Descriptions.Item label={i18n(lang, "ADDRESS_LABEL")}>
        {user.address}
      </Descriptions.Item>
      <Descriptions.Item label={i18n(lang, "LAYER_2_ADDRESS_LABEL")}>
        {user.layer2Address}
      </Descriptions.Item>
    </Descriptions>
  );
};

const selection = select((models) => {
  return {
    user: models.user.fullDetails,
  };
});

const mapStateToProps = (state) => ({
  lang: state.lang,
  ...selection(state),
});

export default connect(mapStateToProps)(Account);
