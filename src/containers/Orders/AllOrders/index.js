import * as apis from "@/apis";
import { trans } from "@/i18n";
import * as utils from "@/utils";
import cn from "classnames";
import { Table2 } from "components";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./allOrders.module.scss";
import Details from "./details";

const i18n = (lang, ...args) => trans("ALL_ORDER", lang, ...args);

class AllOrders extends Component {
  state = {
    activeExpanedRow: null,
    data: [],
    orderData: {},
    loading: true,
    detailLoading: true,
    filters: {},
    pagination: {
      limit: 20,
      current: 1,
    },
  };

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId && prevProps.userId !== this.props.userId) {
      this.fetch();
    }
  }

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
          ...this.state.filters,
        });
      }
    );
  };

  handleFilterSubmit = (filters = {}) => {
    this.setState(
      {
        filters,
        pagination: {
          ...this.state.pagination,
          current: 1,
        },
      },
      () => this.fetch({ page: 1, ...filters })
    );
  };

  fetch = (params = {}) => {
    if (this.props.userId === null) return;
    params.limit = params.limit || this.state.pagination.limit;
    params.page = params.page || this.state.pagination.current;
    params.exclude_state = "wait";

    this.setState({ loading: true });
    apis
      .getMyClosedOrders({ coinPairId: "all", config: { params } })
      .then((result) => {
        this.setState({
          loading: false,
          data: result.data.orders,
          pagination: {
            ...this.state.pagination,
            total: result.data.total,
          },
        });
      });
  };

  toggleDetailBox = (event) => {
    const { id, market } = event.currentTarget.dataset;
    const isCurrentlyShowing = this.state.activeExpanedRow === id;

    this.setState({
      orderData: {},
      detailLoading: true,
      activeExpanedRow: isCurrentlyShowing ? null : id,
    });

    if (!isCurrentlyShowing) {
      apis.getMyOrderDetails({ coinPairId: market, id }).then((res) => {
        this.setState({
          orderData: res.data,
          detailLoading: false,
        });
      });
    }
  };

  renderExpandedRow = (item) => {
    if (this.state.activeExpanedRow !== item.id.toString()) {
      return null;
    }

    return (
      <div className={styles.expandedRow}>
        {!!this.state.orderData ? (
          <Details
            loading={this.state.detailLoading}
            data={this.state.orderData}
          />
        ) : (
          <Details loading={true} />
        )}
        {/* <table>
          <thead>
            <th width="200">{i18n(lang, 'COL_CREATED_AT')}</th>
            <th>{i18n(lang, 'COL_PRICE')}</th>
            <th>{i18n(lang, 'COL_EXEC_VOLUME')}</th>
            <th>{i18n(lang, 'COL_EXEC_AMOUNT')}</th>
            <th>{i18n(lang, 'COL_FEE')}</th>
          </thead>
          <tbody>
            <tr>
              <td width="200">
                <span style={{whiteSpace: 'nowrap'}}>
                  {dayjs(item.created_at).format('YYYY/MM/DD HH:mm:ss')}
                </span>
              </td>
              <td> { item.avg_price || '-' } </td>
              <td> { item.executed_volume || '-' } </td>
              <td> { utils.multiply(item.executed_volume, item.avg_price) || '-' } </td>
              <td> { item.total_fee || '-' } </td>
            </tr>
          </tbody>
        </table> */}
      </div>
    );
  };

  render() {
    const { lang } = this.props;
    const { loading, data, pagination } = this.state;
    //const list = data.filter(item => item.state !== 'wait')
    const columns = [
      {
        key: "time",
        title: i18n(lang, "COL_CREATED_AT"),
        dataIndex: "create_time",
        render: (val) => (
          <span style={{ whiteSpace: "nowrap" }}>
            {utils.dayjsLocal(val).format("YYYY/MM/DD HH:mm:ss")}
          </span>
        ),
      },
      {
        key: "market",
        title: i18n(lang, "COL_MARKET"),
        dataIndex: "market",
      },
      {
        key: "side",
        title: i18n(lang, "COL_SIDE"),
        dataIndex: "order_side",
        render: (val) => (
          <span
            style={{
              color: val === "ASK" ? "#EA2C5F" : "#2eb77a",
              whiteSpace: "nowrap",
            }}
          >
            {i18n(lang, val.toUpperCase())}
          </span>
        ),
      },
      {
        key: "price",
        title: i18n(lang, "COL_PRICE"),
        render: (item) => {
          if (item.order_type === "MARKET") {
            return trans("ACTIVE_ORDER", lang, "MARKET_ORDER_PRICE");
          }
          return utils.normalizeNumByMarket(item.price, item.market, 0);
        },
      },
      {
        key: "exec_vol",
        title: i18n(lang, "COL_EXEC_VOLUME"),
        dataIndex: "amount",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 2),
      },
      {
        key: "avg_price",
        title: i18n(lang, "COL_AVG_PRICE"),
        render: (item) =>
          utils.normalizeNumByMarket(
            utils.div(item.finished_quote, item.finished_base),
            item.market,
            0
          ),
      },
      {
        key: "exec_amount",
        title: i18n(lang, "COL_EXEC_AMOUNT"),
        render: (item) =>
          utils.normalizeNumByMarket(item.finished_quote, item.market, 0),
      },
      {
        key: "state",
        title: i18n(lang, "COL_STATUS"),
        render: (item) => {
          let state = "completed"; // default
          if (item.status === "Cancelled") {
            state = Number(item.finished_base) === 0 ? "cancel" : "partial";
          } else if (item.status === "Filled") {
            state = "completed";
          } else {
            console.log("unknow order state", item);
          }
          return (
            <div className={styles.state}>{trans("STATE", lang, state)}</div>
          );
        },
      },
      {
        key: "action",
        title: i18n(lang, "COL_ACTION"),
        render: (item) =>
          Number(item.finished_base) === 0 ? (
            <div className={cn(styles.detailBtn, styles.disable)}>
              <span className={styles.text}>{i18n(lang, "DETAIL")}</span>
              <i className={cn("iconfont", styles.icon)}> &#xe600; </i>
            </div>
          ) : (
            <div
              className={styles.detailBtn}
              onClick={this.toggleDetailBox}
              data-id={item.id}
              data-market={item.market}
            >
              <span className={styles.text}>{i18n(lang, "DETAIL")}</span>
              <i className={cn("iconfont", styles.icon)}>
                {this.state.activeExpanedRow === item.id ? "\ue601" : "\ue600"}
              </i>
            </div>
          ),
      },
    ];

    // FLDX-151 Hide filters.
    return (
      <React.Fragment>
        {/* <Filter
          showRange
          pairs={pairs}
          lang={lang}
          onSubmit={this.handleFilterSubmit}
        /> */}
        <Table2
          rowKey="id"
          dataSource={data}
          columns={columns}
          classNames={{ wrap: styles.wrap, thead: styles.thead, td: styles.td }}
          loading={loading}
          onChange={this.handleTableChange}
          expandedRowRender={this.renderExpandedRow}
          pagination={{ ...pagination }}
        />
      </React.Fragment>
    );
  }
}

const mapState = (state) => ({
  lang: state.lang,
  pairs: state.markets.pairs,
  userId: state.user.id,
});

export default connect(mapState)(AllOrders);
