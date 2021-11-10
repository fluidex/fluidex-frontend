import * as apis from "@/apis";
import { trans } from "@/i18n";
import { select } from "@/old_store";
import * as utils from "@/utils";
import { Table2, Toast } from "components";
import { Modal } from "fluidex-common/lib/components";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./activeOrders.module.scss";
const i18n = (lang, ...args) => trans("ACTIVE_ORDER", lang, ...args);
const i18nModal = (lang, ...args) => trans("MODAL", lang, ...args);

class ActiveOrders extends Component {
  state = {
    data: [],
    loading: true,
    cancelDialog: false,
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
    if (this.props.isRegistered !== prevProps.isRegistered) {
      this.fetch();
    }
  }

  handleFilterSubmit = (filters = {}) => {
    this.setState(
      {
        filters,
        pagination: {
          ...this.state.pagination,
          current: 1,
        },
      },
      () => this.fetch({ page: 1 })
    );
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
    //params.page = params.page || this.state.pagination.current;
    params.offset =
      (params.page || this.state.pagination.current - 1) * params.limit;
    //params.state = "wait";
    // params.time_from = dayjs().startOf('day').unix()

    this.setState({ loading: true });

    apis
      .getMyOpenOrders({
        coinPairId: "all",
        config: { params: { ...params, ...this.state.filters } },
      })
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

  handleCancel = (event) => {
    if (!this.props.checkAuthorizationAndMaybeShowModal()) {
      return;
    }

    const item = event.currentTarget.dataset;
    apis
      .cancelOrder({ id: item.id, market: item.market })
      .then(() => {
        this.fetch();
        Toast.success("Done");
      })
      .catch(() => {
        Toast.error("Error");
      });
  };

  handleCancelAll = () => {
    if (!this.props.checkAuthorizationAndMaybeShowModal()) {
      return;
    }
    let markets = new Set(this.state.data.map((e) => e.market));
    Promise.all([...markets].map((market) => apis.cancelOrders({ market })))
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
    const { lang } = this.props;
    const { loading, data, pagination, cancelDialog } = this.state;
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
        dataIndex: "price",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 0),
      },
      {
        key: "volume",
        title: i18n(lang, "COL_VOLUME"),
        dataIndex: "amount",
        render: (val, item) => utils.normalizeNumByMarket(val, item.market, 2),
      },
      {
        key: "total",
        title: i18n(lang, "COL_TOTAL"),
        render: (item) =>
          utils.normalizeNumByMarket(
            utils.multiply(item.amount, item.price),
            item.market,
            0
          ),
      },
      {
        key: "exec_vol",
        title: i18n(lang, "COL_EXEC_VOL"),
        render: (item) =>
          utils.normalizeNumByMarket(
            utils.multiply(item.price, item.finished_base),
            item.market,
            2
          ),
      },
      {
        key: "unexec_vol",
        title: i18n(lang, "COL_UNEXEC_VOL"),
        render: (item) => (
          <span>{utils.normalizeNumByMarket(item.remain, item.market, 2)}</span>
        ),
      },
      {
        key: "col_act",
        title: i18n(lang, "COL_ACTION"),
        render: (item) => (
          <span
            className={styles.cancel}
            data-market={item.market}
            data-id={item.id}
            onClick={this.handleCancel}
          >
            {i18n(lang, "CANCEL")}
          </span>
        ),
      },
    ];
    return (
      <React.Fragment>
        <div style={{ position: "relative" }}>
          {data.length > 0 ? (
            <div
              className={styles["cancel-all"]}
              onClick={() => {
                this.setState({ cancelDialog: true });
              }}
            >
              {i18n(lang, "CANCEL_ALL")}
            </div>
          ) : (
            ""
          )}
          {/* // FLDX-151 Hide filters. */}
          {/* <Filter
            pairs={pairs}
            lang={lang}
            onSubmit={this.handleFilterSubmit}
          /> */}
        </div>
        <Table2
          rowKey="id"
          dataSource={data}
          columns={columns}
          classNames={{ wrap: styles.wrap, thead: styles.thead }}
          loading={loading}
          onChange={this.handleTableChange}
          pagination={{ ...pagination }}
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
      </React.Fragment>
    );
  }
}

const selection = select((models) => ({
  isRegistered: models.user.isRegistered,
}));

const mapStateToProps = (state) => ({
  lang: state.lang,
  pairs: state.markets.pairs,
  ...selection(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkAuthorizationAndMaybeShowModal:
    dispatch.user.checkAuthorizationAndMaybeShowModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(ActiveOrders);
