import * as apis from "@/apis";
import { trans } from "@/i18n";
import * as utils from "@/utils";
import { Table2, Toast } from "components";
import { Modal } from "fluidex-common/lib/components";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import styles from "./activeOrders.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_ACTIVE_ORDERS", lang, ...args);
const i18nModal = (lang, ...args) => trans("MODAL", lang, ...args);
class ActiveOrders extends Component {
  state = {
    data: [],
    loading: true,
    cancelDialog: false,
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
      () => this.fetch()
    );
  };

  fetch = (providedParam = {}) => {
    const params = {};
    params.limit = providedParam.limit || this.state.pagination.limit;
    params.offset =
      providedParam.page || (this.state.pagination.current - 1) * params.limit;

    this.clearSubscriptionAndAsync("abortRequest");

    this.props
      .fetchOrders({
        coinPairId: this.props.coinPair.id,
        config: { params },
      })
      .then(() => {
        this.timer = setTimeout(() => this.fetch(), 3 * 1000);
        this.setState({
          loading: false,
          pagination: {
            ...this.state.pagination,
            total: this.props.total,
          },
        });
      });
  };

  handleCancel = (event) => {
    if (!this.props.checkAuthorizationAndMaybeShowModal()) {
      return;
    }
    const id = event.currentTarget.dataset.id;
    const market = event.currentTarget.dataset.market;
    apis
      .cancelOrder({ id, market })
      .then(() => {
        this.fetch();
        Toast.success(i18n(this.props.lang, "CANCEL_DONE"));
      })
      .catch(() => {
        Toast.error(i18n(this.props.lang, "CANCEL_FAILD"));
      });
  };

  handleCancelAll = (event) => {
    if (!this.props.checkAuthorizationAndMaybeShowModal()) {
      return;
    }
    const { quoteCoin, baseCoin } = this.props.match.params;
    const market = utils.getPair(quoteCoin, baseCoin).id;
    apis
      .cancelOrders({ market })
      .then(() => {
        this.fetch();
        this.setState({ cancelDialog: false });
        Toast.success(i18n(this.props.lang, "CANCEL_DONE"));
      })
      .catch(() => {
        this.setState({ cancelDialog: false });
        Toast.error(i18n(this.props.lang, "CANCEL_FAILD"));
      });
  };

  render() {
    // NOTE: Normally, the market transaction will be completed directly, so there is no need to display it in the active
    const { lang, data } = this.props;
    const { pagination, loading, cancelDialog } = this.state;
    //const list = data.filter(item => item.ord_type === 'limit' && item.state === 'wait')
    //console.log("active order data", data);
    const list = data.filter((item) => item.order_type === "LIMIT");
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
        dataIndex: "price",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 0),
      },
      {
        key: "vol",
        title: i18n(lang, "TABLE_COL_VOLUME"),
        dataIndex: "amount",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 2),
      },
      {
        key: "total_vol",
        title: i18n(lang, "TABLE_COL_TOTAL_VOLUME"),
        render: (item) =>
          utils.normalizeNumByMarket(
            utils.multiply(item.amount, item.price),
            item.market,
            0
          ),
      },
      {
        key: "exec_vol",
        title: i18n(lang, "TABLE_COL_EXEX_VOLUME"),
        dataIndex: "finished_base",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 2),
      },
      {
        key: "unexec_vol",
        title: i18n(lang, "TABLE_COL_UNEXEX_VOLUME"),
        render: (item) => (
          <span>{utils.normalizeNumByMarket(item.remain, item.market, 2)}</span>
        ),
      },
      {
        key: "action",
        title: i18n(lang, "TABLE_COL_ACTION"),
        render: (item) => (
          <span
            className={styles.cancel}
            data-market={item.market}
            data-id={item.id}
            onClick={this.handleCancel}
          >
            {i18n(lang, "TABLE_COL_CANCEL")}
          </span>
        ),
      },
    ];

    return (
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className={styles.title}>
            {this.props.title}

            <div className={styles.titleLinks}>
              <Link to="/exchange/orders/active" className={styles.titleLink}>
                {i18n(lang, "CHECK_MORE")}
              </Link>
              {list.length > 0 && (
                <span
                  className={styles.titleLink}
                  onClick={() => {
                    this.setState({ cancelDialog: true });
                  }}
                >
                  {i18n(lang, "CANCEL_ALL")}
                </span>
              )}
            </div>
          </div>
        </div>
        <Table2
          size="small"
          rowKey="id"
          dataSource={list}
          columns={columns}
          classNames={{ wrap: styles.tableWrap }}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={pagination}
        />
        <Modal
          visible={cancelDialog}
          onClose={() => {
            this.setState({ cancelDialog: false });
          }}
          maskClosable
          responsive
          title={i18nModal(lang, "TITLE")}
        >
          <div className={styles["active-orders-dialog"]}>
            <span> {i18n(lang, "CANCEL_CONFIRM")}</span>
            <div className="dialog-btn-list">
              <button
                className="dialog-btn dialog-btn-ok"
                onClick={this.handleCancelAll}
              >
                {i18nModal(lang, "OK")}
              </button>
              <button
                className="dialog-btn dialog-btn-cancel"
                onClick={() => {
                  this.setState({ cancelDialog: false });
                }}
              >
                {i18nModal(lang, "CANCEL")}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
  fetchOrders: dispatch.orders.getAll,
});

const mapStateToProps = (state) => {
  return {
    total: state.orders.total,
    data: state.orders.orders,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ActiveOrders)
);
