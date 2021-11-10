import { Spin } from "components";
import Header from "components/Header";
import Account from "containers/Account";
import Assets from "containers/Assets";
import Exchange from "containers/Exchange";
import InternalTransactions from "containers/InternalTransactions";
import Layer2Explorer from "containers/Layer2Explorer";
import Layer2BlockDetail from "containers/Layer2Explorer/block";
import Layer2TokenDetail from "containers/Layer2Explorer/token";
import Layer2AccountDetail from "containers/Layer2Explorer/account";
import Markets from "containers/Markets";
import Orders from "containers/Orders";
import cookie from "js-cookie";
import React, { PureComponent, useState } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import styles from "./app.module.scss";
import RootModal from "./RootModal";

const authRouteMapStateToProps = (state) => ({
  layer2Address: state.ethereum.layer2Address,
});

const authRouteMapDispatchToProps = (dispatch) => ({
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
});

const AuthRoute = connect(
  authRouteMapStateToProps,
  authRouteMapDispatchToProps
)(
  ({
    component: Component,
    layer2Address,
    checkAuthorizationAndMaybeShowModal,
    ...rest
  }) => {
    const [firstRender, setFirstRender] = useState(true);

    if (!layer2Address) {
      if (!firstRender) {
        if (
          !checkAuthorizationAndMaybeShowModal({
            locallyStoredCredentialsOnly: true,
          })
        ) {
          return null;
        }
      } else {
        // We need to wait for store subscriber to get layer 2 address from local storage.
        // TODO: investigate proper wait strategy for store subscribers.
        setTimeout(() => setFirstRender(false), 500);
        return null;
      }
    }

    return (
      <Route
        {...rest}
        render={(props) => {
          return <Component {...props} />;
        }}
      />
    );
  }
);

class App extends PureComponent {
  state = {
    loading: true,
    error: null,
  };

  initLang = () => {
    const lang = cookie.get("lang");
    lang && this.props.serLang(lang);
  };

  componentDidMount() {
    // auth ，The lang part needs to be moved to the src/index layer
    this.initLang();

    this.fetch()
      .catch((err) => {
        this.setState({ error: err });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  fetch = () => {
    if (this.fetchTimer) {
      clearTimeout(this.fetchTimer);
      this.fetchTimer = null;
    }

    const apis = [this.props.getCurrencies(), this.props.getPairs()];

    apis.push(this.props.getAssets());
    return Promise.all(apis).finally(() => {
      if (!this.state.error) {
        this.fetchTimer = setTimeout(this.fetch, 3 * 1000);
      }
    });
  };

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  renderBody = () => {
    const lastVistMarketId = Exchange.getLastVistMarketId();

    if (this.state.loading) {
      return (
        <Spin loading={true} hasOverlay={false}>
          <div style={{ height: "calc(100vh - 200px)" }}></div>
        </Spin>
      );
    }

    // if (this.state.error) {
    //   return (
    //     <InternelServerError style={{marginBottom: -10}} />
    //   )
    // }

    return (
      <React.Fragment>
        <Switch>
          <Redirect from="/" strict exact to={`/exchange/markets`} />
          <Redirect
            from="/exchange"
            strict
            exact
            to={`/exchange/trade/${lastVistMarketId}`}
          />
          <Redirect
            from="/trade"
            strict
            exact
            to={`/exchange/trade/${lastVistMarketId}`}
          />
          <Redirect
            from="/exchange/trade"
            strict
            exact
            to={`/exchange/trade/${lastVistMarketId}`}
          />
          <Redirect from="/markets" strict exact to={"/exchange/markets"} />
          <Route
            path="/exchange/trade/:baseCoin\_:quoteCoin"
            component={Exchange}
          />
          <Route path="/exchange/markets" component={Markets} />
          <AuthRoute path="/exchange/assets" component={Assets} />
          <AuthRoute path="/exchange/orders" component={Orders} />
          <AuthRoute path="/exchange/account" component={Account} />
          <AuthRoute
            path="/exchange/internal_transactions"
            component={InternalTransactions}
          />
          <Route path="/explorer" exact component={Layer2Explorer} />
          <Route
            path="/explorer/block/:blockId"
            component={Layer2BlockDetail}
          />
          <Route
            path="/explorer/token/:tokenId"
            component={Layer2TokenDetail}
          />
          <Route
            path="/explorer/account/:accountId"
            component={Layer2AccountDetail}
          />
        </Switch>
      </React.Fragment>
    );
  };

  render() {
    return (
      <BrowserRouter basename={process.env.BASE_PATH}>
        <div className={styles.app}>
          <Header />
          <div className={styles.main}>{this.renderBody()}</div>
          <RootModal />
          {/*<Footer />*/}
        </div>
      </BrowserRouter>
    );
  }
}

const mapDispatch = (dispatch) => ({
  getCurrencies: dispatch.currencies.getAll,
  getPairs: dispatch.markets.getPairs,
  getAssets: dispatch.assets.getAll,
  serLang: dispatch.lang.setLang,
});

export default connect(null, mapDispatch)(App);
