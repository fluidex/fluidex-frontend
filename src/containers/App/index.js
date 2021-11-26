import { Spin } from "components";
import NoticeBar from "components/NoticeBar";
import Header from "components/Header";

import cookie from "js-cookie";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import styles from "./app.module.scss";
import RootModal from "./RootModal";
import Routes from "./routes";
import request from "@/utils/request";
class App extends PureComponent {
  state = {
    loading: true,
    error: null,
    pathname: "",
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

  setPathname = (pathname) => {
    if (this.state.pathname) {
      request.clear(); // clear all pending request
    }
    this.setState({ pathname });
  };

  renderBody = () => {
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

    return <Routes setPathname={this.setPathname} />;
  };

  render() {
    return (
      <BrowserRouter basename={process.env.BASE_PATH}>
        <div className={styles.app}>
          <NoticeBar />
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
