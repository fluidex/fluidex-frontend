import { trans } from "@/i18n";
import { getLengthLimitedString } from "@/utils";
import { Tooltip } from "antd";
import cn from "classnames";
import { Button } from "components";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";

const i18n = (lang, ...args) => trans("HEADER", lang, ...args);

const langArray = [
  { label: "EN", value: "en" },
  { label: "中文", value: "zh" },
];

export default class Header extends Component {
  static defaultProps = {
    onLanChange: () => {},
    onLogout: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showLan: false,
      showMenu: false,
      showAccount: false,
      showAssets: false,
      showOrders: false,
      isConnectingToWallet: false,
    };
  }

  onLanChange = (e) => {
    const { lan } = e.currentTarget.dataset;
    this.setState({
      showLan: false,
      showMenu: false,
    });
    this.props.onLanChange(lan);
  };

  onToggle = (name) => () => {
    this.setState({
      [name]: !this.state[name],
    });
  };

  onLogin = () => {
    if (!this.props.user.isConnected) {
      if (this.props.onLogin) {
        this.props.onLogin();
      } else {
        window.location.href = "/v2/login";
      }
    }
  };

  handleConnectToWalletButtonClick = () => {
    this.setState({ isConnectingToWallet: true });
    this.props.onConnect().finally(() => {
      this.setState({ isConnectingToWallet: false });
    });
  };

  render() {
    const { isConnectingToWallet } = this.state;
    const {
      user: { isConnected, displayedName } = {},
      lang,
      pathname,
      responsive = false,
      hasMetaMask,
      checkAuthorizationAndMaybeShowModal,
    } = this.props;

    const MAX_CHARS_SHOWN = 17;
    const NUM_FIRST_CHARS_SHOWN = 12;
    const lengthLimitedDisplayedName = getLengthLimitedString(
      displayedName,
      NUM_FIRST_CHARS_SHOWN,
      MAX_CHARS_SHOWN
    );

    let walletBlock = (
      <>
        <button className={styles.niceName}>
          {lengthLimitedDisplayedName}
        </button>
        <ul className={styles["content"]}>
          <li>
            <Link to="/exchange/account">{i18n(lang, "ACCOUNT")}</Link>
          </li>
          <li>
            <Link to="/exchange/internal_transactions">
              {i18n(lang, "INTERNAL_TRANSACTIONS")}
            </Link>
          </li>
        </ul>
      </>
    );
    if (!isConnected) {
      walletBlock = (
        <Button
          className={styles.connectWalletButton}
          loading={isConnectingToWallet}
          size="small"
        >
          {i18n(lang, "CONNECT_WALLET")}
        </Button>
      );
    }
    if (!hasMetaMask) {
      walletBlock = (
        <Tooltip
          placement="bottom"
          title={i18n(lang, "PLEASE_INSTALL_METAMASK")}
        >
          {walletBlock}
        </Tooltip>
      );
    }

    const leftNav = [
      {
        title: i18n(lang, "MARKETS"),
        to: "/exchange/markets",
      },
      {
        title: i18n(lang, "EXCHANGE"),
        to: "/exchange/trade",
      },
      {
        title: i18n(lang, "LAYER_2_EXPLORER"),
        to: "/explorer",
      },
      {
        title: i18n(lang, "FAUCET"),
        menu: [
          <a
            href="http://www.fluidex.io/faucet/"
            target="_blank"
            rel="noreferrer"
          >
            {i18n(lang, "LAYER_1_FAUCET")}
          </a>,
          <a className={styles.disabled} href="#" rel="noreferrer">
            {i18n(lang, "LAYER_2_FAUCET")}
          </a>,
        ],
      },
    ];
    const rightNav = [
      {
        title: i18n(lang, "ASSETS"),
        needLogin: true,
        to: "/exchange/assets",
        // menu: [
        //   <Link to="/exchange/assets">{i18n(lang, "DepositDraw")}</Link>,
        //   <a href="/v2/assets/records">{i18n(lang, "DepositDrawRecord")}</a>,
        // ],
      },
      {
        title: i18n(lang, "ORDERS"),
        needLogin: true,
        to: "/exchange/orders",
        // menu: [<Link to="/exchange/orders">{i18n(lang, "EXCHANGE_ORDER")}</Link>],
      },
    ];
    return (
      <div
        className={cn(
          styles["header-container"],
          responsive ? styles.responsive : ""
        )}
        id="fluidexHeader"
      >
        <div className={styles["header-box"]}>
          <a href="/" className={styles["logo"]}>
            <i />
          </a>
          <div className={styles["pc-nav"]}>
            <ul className={styles["left"]}>
              {leftNav.map((child, idx) => (
                <li
                  key={idx}
                  className={cn(
                    styles[pathname.startsWith(child.to) ? "active" : ""],
                    styles.navItems
                  )}
                >
                  {child.to ? (
                    <Link to={child.to}>
                      {child.title}{" "}
                      {child.image && <img src={child.image} alt="" />}
                    </Link>
                  ) : (
                    <a>
                      {child.title}{" "}
                      {child.image && <img src={child.image} alt="" />}
                    </a>
                  )}
                  <ul className={styles["content"]}>
                    {child.menu &&
                      child.menu.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
            <ul className={styles["right"]}>
              {rightNav
                .map((child, idx) => {
                  return (
                    <li
                      key={idx}
                      className={styles.navItems}
                      onClick={() => {
                        if (!isConnected && child.needLogin) {
                          checkAuthorizationAndMaybeShowModal();
                          return;
                        }

                        child.onClick && child.onClick();
                      }}
                    >
                      {child.to ? (
                        <Link to={child.to}>
                          {child.title}{" "}
                          {child.image && <img src={child.image} alt="" />}
                        </Link>
                      ) : (
                        <a>
                          {child.title}{" "}
                          {child.image && <img src={child.image} alt="" />}
                        </a>
                      )}
                      {(!child.needLogin || isConnected) && (
                        <ul className={styles["content"]}>
                          {child.menu &&
                            child.menu.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      )}
                    </li>
                  );
                })
                .filter(React.isValidElement)}

              <li
                className={cn(
                  styles.navItems,
                  // styles.nonClickableAccountBox,
                  styles.accountBox,
                  isConnected ? styles.active : ""
                )}
                onClick={
                  isConnected
                    ? undefined
                    : this.handleConnectToWalletButtonClick
                }
              >
                {walletBlock}
              </li>
              <li className={styles["lan-box"]}>
                <a className={styles["lan-earth"]}>
                  <i />
                  <span className={styles["lan-name"]}>
                    {i18n(lang, "CUR_LANGUAGE")}
                  </span>
                </a>
                <ul className={styles["lan"]}>
                  {langArray.map((item) => (
                    <li
                      key={item.value}
                      data-lan={item.value}
                      onClick={this.onLanChange}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
