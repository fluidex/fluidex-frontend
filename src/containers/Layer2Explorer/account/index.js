import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styles from "./account.module.scss";
import Descriptions from "@/components/Descriptions";
import { trans } from "@/i18n";
import { getUserDetails } from "@/apis";
import { withRouter } from "react-router-dom";

const i18n = (lang, ...args) => trans("ACCOUNT", lang, ...args);

class AccountDetail extends PureComponent {
  state = {
    user: {},
  };

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    let accountId = this.props.match.params.accountId;
    getUserDetails(accountId).then(({ data }) => {
      this.setState({
        user: data,
      });
    });
  };

  render() {
    const { lang } = this.props;
    const { user } = this.state;
    const L1_EXPLORER_BASE_URL = process.env.REACT_APP_L1_EXPLORER_BASE_URL;
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
          <a
            href={`${L1_EXPLORER_BASE_URL}address/${user.l1_address}`}
            target="_blank"
            rel="noreferrer"
          >
            {user.l1_address}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label={i18n(lang, "LAYER_2_ADDRESS_LABEL")}>
          {user.l2_pubkey}
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

const mapStateToProps = (state) => ({
  lang: state.lang,
});

export default connect(mapStateToProps)(withRouter(AccountDetail));
