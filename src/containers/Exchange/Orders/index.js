import * as apis from "@/apis";
import { trans } from "@/i18n";
import * as utils from "@/utils";
import axios from "axios";
import { Table2 } from "components";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./orders.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_ALL_ORDERS", lang, ...args);

class Orders extends Component {
  state = {
    data: [],
    loading: true,
    pagination: {
      limit: 6,
      current: 1,
    },
  };

  constructor(props) {
    super(props);

    if (!props.isRegistered) {
      this.state.loading = false;
    }
  }

  componentDidMount() {
    if (this.props.isRegistered) {
      this.fetch();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isRegistered === true && prevProps.isRegistered === false) {
      this.fetch();
    } else if (
      this.props.isRegistered === false &&
      prevProps.isRegistered === true
    ) {
      this.clearSubscriptionAndAsync();
    }
  }

  componentWillUnmount() {
    this.clearSubscriptionAndAsync();
  }

  clearSubscriptionAndAsync = (message) => {
    if (this.abortRequest) {
      this.abortRequest(message);
      this.abortRequest = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  handleTableChange = ({ pagination }) => {
    this.setState(
      {
        pagination: {
          ...this.state.pagination,
          current: pagination.current,
        },
      },
      () => {
        this.fetch({
          limit: this.state.pagination.limit,
          page: this.state.pagination.current,
        });
      }
    );
  };

  fetch = (params = {}) => {
    params.limit = params.limit || this.state.pagination.limit;
    params.page = params.page || this.state.pagination.current;
    params.exclude_state = "wait";

    this.clearSubscriptionAndAsync("force abort");

    apis
      .getMyClosedOrders(
        { coinPairId: this.props.coinPair.id, config: { params } },
        {
          cancelToken: new axios.CancelToken((cancel) => {
            this.abortRequest = cancel;
          }),
        }
      )
      .then((result) => {
        this.setState({
          loading: false,
          data: result.data.orders,
          pagination: {
            ...this.state.pagination,
            total: result.data.total,
          },
        });
      })
      .finally(() => {
        this.abortRequest = null;
        this.timer = setTimeout(this.fetch, 3 * 1000);
      });
  };

  render() {
    const { lang } = this.props;
    const { loading, data, pagination } = this.state;
    const columns = [
      {
        key: "time",
        title: i18n(lang, "TABLE_COL_CREATED_AT"),
        dataIndex: "create_time",
        render: (val) => utils.dayjsLocal(val).format("YYYY/MM/DD HH:mm:ss"),
      },
      {
        key: "market",
        title: i18n(lang, "TABLE_COL_MARKET"),
        dataIndex: "market",
      },
      {
        key: "side",
        title: i18n(lang, "TABLE_COL_SIDE"),
        dataIndex: "order_side",
        render: (val) => (
          <span style={{ color: val === "ASK" ? "#EA2C5F" : "#2EB77A" }}>
            {i18n(lang, val.toUpperCase())}
          </span>
        ),
      },
      {
        key: "price",
        title: i18n(lang, "TABLE_COL_PRICE"),
        render: (item) => {
          if (item.order_type === "MARKET") {
            return trans("ACTIVE_ORDER", lang, "MARKET_ORDER_PRICE");
          }
          return utils.normalizeNumByMarket(item.price, item.market, 0);
        },
      },
      {
        key: "total_vol",
        title: i18n(lang, "TABLE_COL_TOTAL_VOLUME"),
        dataIndex: "amount",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 2),
      },
      {
        key: "avg_price",
        title: i18n(lang, "TABLE_COL_AVG_PRICE"),
        render: (item) =>
          utils.normalizeNumByMarket(
            utils.div(item.finished_quote, item.finished_base),
            item.market,
            0
          ),
      },
      {
        key: "exex_vol",
        dataIndex: "finished_quote",
        title: i18n(lang, "TABLE_COL_VOLUME_X"),
        //render: item => utils.normalizeNumByMarket(utils.multiply(item.executed_volume, item.avg_price), item.market_name, 0)
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 0),
      },
      {
        key: "state",
        title: i18n(lang, "TABLE_COL_STATE"),
        render: (item) => {
          let state = item.state;
          if (item.state === "cancel") {
            state = Number(item.executed_volume) === 0 ? "reject" : "cancel";
          }
          state = "completed"; //TODO
          return trans("STATE", lang, state);
        },
      },
    ];

    return (
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className={styles.title}>{this.props.title}</div>
          <span className={styles.subTitle}>{i18n(lang, "LAST_7DAYS")}</span>
          <Link to="/exchange/orders/all" className={styles.more}>
            {i18n(lang, "CHECK_MORE")}
          </Link>
        </div>
        <Table2
          size="small"
          rowKey="id"
          dataSource={data}
          columns={columns}
          classNames={{ wrap: styles.tableWrap }}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={pagination}
        />
      </div>
    );
  }
}

export default Orders;
