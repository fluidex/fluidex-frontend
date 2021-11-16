import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import cn from "classnames";
import { withRouter } from "react-router-dom";
import styles from "./noticebar.module.scss";
import { InfoCircleOutlined } from "@ant-design/icons";
import { NetworksEnum, NetworksNameEnum } from "@/models/user";
import { trans } from "@/i18n";
const i18n = (lang, ...args) => trans("NOTICEBAR", lang, ...args);

function NoticeBar(props) {
  const { lang, currentNetwork, network, switchEthereumChain } = props;

  useEffect(() => {
    if (network !== NetworksEnum.Mocknet) {
      setIfNotMatch(currentNetwork !== network);
    }
  }, [currentNetwork, network]);

  const [notMatch, setIfNotMatch] = useState(false);

  return (
    <div className={cn(styles["noticebar-box"], notMatch && styles.active)}>
      <div
        className={styles.content}
        onClick={() => switchEthereumChain(network)}
      >
        <InfoCircleOutlined className={styles["info-icon"]} />
        <div>
          {i18n(lang, "TEXT")} {NetworksNameEnum[currentNetwork]},{" "}
          <a className={styles["switch-button"]}>
            {i18n(lang, "LINK_TEXT")} {NetworksNameEnum[network]}
          </a>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  lang: state.lang,
  currentNetwork: state.ethereum.currentNetwork,
  network: state.user.network,
});

const mapDispatchToProps = (dispatch) => ({
  switchEthereumChain: dispatch.ethereum.switchEthereumChain,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NoticeBar));
