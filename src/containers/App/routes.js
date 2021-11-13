import React, { useEffect, useState } from "react";
import { Router, Route, Switch, Redirect, useLocation } from "react-router-dom";
import { connect } from "react-redux";
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

function Routes(props) {
  const location = useLocation();
  const lastVistMarketId = Exchange.getLastVistMarketId();

  useEffect(() => {
    props.setPathname(location.pathname);
  }, [location]);

  return (
    <>
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
        <Route path="/explorer/block/:blockId" component={Layer2BlockDetail} />
        <Route path="/explorer/token/:tokenId" component={Layer2TokenDetail} />
        <Route
          path="/explorer/account/:accountId"
          component={Layer2AccountDetail}
        />
      </Switch>
    </>
  );
}

export default Routes;
