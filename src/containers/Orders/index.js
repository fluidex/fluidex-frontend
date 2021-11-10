import { trans } from "@/i18n";
import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import ActiveOrders from "./ActiveOrders";
import AllOrders from "./AllOrders";
import styles from "./orders.module.scss";
const i18n = (lang, ...args) => trans("ORDERS", lang, ...args);

function Orders({ lang }) {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{i18n(lang, "TIT")} | FluiDex</title>
      </Helmet>
      <div className={styles.header}>
        <h1 className={styles.title}>{i18n(lang, "TIT")}</h1>
        <div className={styles.tabs}>
          <NavLink
            to="/exchange/orders/active"
            className={styles.tab}
            activeClassName={styles.active}
          >
            {i18n(lang, "ACTIVE_ORDER")}
          </NavLink>
          <NavLink
            to="/exchange/orders/all"
            className={styles.tab}
            activeClassName={styles.active}
          >
            {i18n(lang, "ALL_ORDER")}
          </NavLink>
        </div>
      </div>
      <div className={styles.content}>
        <Switch>
          <Redirect
            path="/exchange/orders"
            exact
            to="/exchange/orders/active"
          />
          <Route path="/exchange/orders/active" component={ActiveOrders} />
          <Route path="/exchange/orders/all" component={AllOrders} />
        </Switch>
      </div>
    </div>
  );
}

const mapState = (state) => ({
  lang: state.lang,
});

export default connect(mapState)(Orders);
