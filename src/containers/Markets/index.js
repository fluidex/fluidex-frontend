import * as apis from "@/apis";
import { trans } from "@/i18n";
import cn from "classnames";
import { Table2 } from "components";
import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import styles from "./Markets.module.scss";
const i18n = (lang, ...args) => trans("MARKETS", lang, ...args);
class Markets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      pagination: {
        limit: 10,
        current: 1,
      },
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  fetch = () => {
    const { pairList } = this.props;
    Promise.all(pairList.map((item) => apis.getTickerOfMarket(item.name)))
      .then((result) => {
        result = result.map((r) => r.data);
        this.setState({
          loading: false,
          data: result,
        });
      })
      .catch((e) => {});
  };

  startTimer = () => {
    this.fetch();
    this.fetchTimer = setTimeout(this.startTimer, 3 * 1000);
  };

  stopTimer = () => {
    clearTimeout(this.fetchTimer);
  };

  handleTableChange = ({ pagination }) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: pagination.current,
        },
      },
      () => this.fetch()
    );
  };

  moveToTradePage = (market) => {
    this.props.history.push(`/exchange/trade/${market}`);
  };

  render() {
    const { lang } = this.props;
    const { pagination, loading, data } = this.state;
    const siteTitle = i18n(lang, "TIT");
    const columns = [
      {
        key: "base",
        title: i18n(lang, "TABLE_COL_NAME"),
        dataIndex: "base",
        render: (val, row, index) => {
          const [symbol, unit] = row.market.split("_");
          return (
            <div className={styles.nameColumn}>
              <div className={styles.symbol}>{symbol}</div>
              <div className={styles.name}>
                {}/{unit}
              </div>
            </div>
          );
        },
      },
      {
        key: "price",
        title: i18n(lang, "TABLE_COL_PRICE"),
        dataIndex: "last",
        render: (val, row, index) => {
          return (
            <div
              className={cn(
                styles.priceColumn,
                row.last > 0 ? styles.increase : styles.decrease
              )}
            >
              ${row.last > 0.1 ? row.last.toFixed(2) : row.last.toFixed(6)}
            </div>
          );
        },
      },
      {
        key: "price_change_percent",
        title: i18n(lang, "TABLE_COL_24H_CHANGE"),
        dataIndex: "price_change_percent",
        sorter: (a, b) => a.price_change_percent - b.price_change_percent,
        render: (val, row, index) => {
          return val ? (
            <div
              className={cn(
                val > 0 ? styles.increase : styles.decrease,
                styles.changeColumn
              )}
            >
              {val > 0 ? `+${(val * 100).toFixed(2)}` : (val * 100).toFixed(2)}%
            </div>
          ) : (
            <div className={cn(styles.increase, styles.changeColumn)}>
              0.00%
            </div>
          );
        },
      },
      {
        key: "quote_volume",
        title: i18n(lang, "TABLE_COL_24H_VOLUME"),
        dataIndex: "quote_volume",
        sorter: (a, b) => a.quote_volume - b.quote_volume,
        render: (val, row, index) => {
          return <div className={styles.volumeColumn}>{val}</div>;
        },
      },
      {
        key: "high_low",
        title: i18n(lang, "TABLE_COL_24H_HIGH_LOW"),
        render: (val, row, index) => {
          return (
            <div className={styles.volumeColumn}>
              {val.high} / {val.low}
            </div>
          );
        },
      },
      {
        key: "action",
        title: i18n(lang, "TABLE_COL_ACTION"),
        render: (val) => {
          return (
            <div className={styles.actionColumn}>
              <div
                className={styles.action}
                onClick={() => this.moveToTradePage(val.market)}
              >
                {i18n(lang, "TABLE_TRADE")}
              </div>
            </div>
          );
        },
      },
    ];

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{siteTitle} | FluiDex</title>
        </Helmet>
        <div className={styles.pageHeaderContainer}>
          <h1 className={styles.pageHeader}>{i18n(lang, "TIT")}</h1>
        </div>
        <Table2
          rowKey="symbol"
          dataSource={data}
          classNames={{ wrap: styles.marketsList, thead: styles.thead }}
          columns={columns}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={pagination}
          onRowKey={(item) => item.symbol}
        />
      </div>
    );
  }
}

const mapState = (state, props) => ({
  lang: state.lang,
  pairList: state.markets.pairs.list,
});

export default connect(mapState)(Markets);
