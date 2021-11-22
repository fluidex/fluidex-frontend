import { getBlockDetail } from "@/apis/block";
import { trans } from "@/i18n";
import { dayjsLocal } from "@/utils";
import { Col, Row } from "antd";
import cn from "classnames";
import { Table2 } from "components";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./Block.module.scss";
import Details from "./details";

const i18n = (lang, ...args) => trans("LAYER_2_EXPLORER_DETAIL", lang, ...args);
export const TYPE_MAP = {
  SPOT_TRADE: "spot_trade_tx",
  DEPOSIT: "deposit_tx",
  WITHDRAW: "withdraw_tx",
  TRANSFER: "transfer_tx",
  NOP: "nop",
};

class BlockDetail extends Component {
  state = {
    activeExpanedRow: null,
    data: [],
    loading: true,
    blockInfo: {
      created_time: "",
      new_root: "",
      real_tx_num: "",
      status: "",
      tx_num: "",
      txs: [],
      decoded_txs: [],
      l1_tx_hash: "",
    },
  };

  componentDidMount() {
    this.fetch(this.props.blockId);
  }

  fetch = (blockId) => {
    this.setState({ loading: true, activeExpanedRow: null });

    getBlockDetail({
      blockId,
    }).then((result) => {
      let blockInfo = result.data;
      blockInfo.decoded_txs.map((txs, idx) => {
        let type = blockInfo.txs_type[idx];
        blockInfo.decoded_txs[idx] = {
          type,
          ...txs[TYPE_MAP[type]],
        };
        return type;
      });
      this.setState({
        loading: false,
        blockInfo,
      });
    });
  };

  toggleDetailBox = (index) => {
    const isCurrentlyShowing = this.state.activeExpanedRow === index;
    this.setState({
      activeExpanedRow: isCurrentlyShowing ? null : index,
    });
  };

  renderExpandedRow = (item, index) => {
    if (this.state.activeExpanedRow !== index) {
      return null;
    }
    return (
      <div className={styles.expandedRow}>
        <Details data={item} />
      </div>
    );
  };

  onPrev = () => {
    const { history, blockId } = this.props;
    const newBlockId = +blockId - 1;
    history.push(`/explorer/block/${newBlockId}`);
    this.fetch(newBlockId);
  };

  onNext = () => {
    const { history, blockId } = this.props;
    const newBlockId = +blockId + 1;
    history.push(`/explorer/block/${newBlockId}`);
    this.fetch(newBlockId);
  };

  render() {
    const { lang, blockId } = this.props;
    const { loading, blockInfo } = this.state;
    const NETWORK_BASE_URL = process.env.REACT_APP_NETWORK_BASE_URL;
    const columns = [
      {
        key: "hash",
        title: i18n(lang, "COL_INDEX"),
        dataIndex: "index",
        render: (val, row, index) => index + 1,
      },
      {
        key: "type",
        title: i18n(lang, "COL_TYPE"),
        dataIndex: "type",
        render: (val) => i18n(lang, val),
      },
      {
        key: "action",
        title: i18n(lang, "COL_ACTION"),
        render: (val, index) =>
          val.type !== TYPE_MAP.NOP && (
            <div
              className={styles.detailBtn}
              onClick={() => this.toggleDetailBox(index)}
            >
              <span className={styles.text}>{i18n(lang, "DETAIL")}</span>
              <i className={cn("iconfont", styles.icon)}>
                {this.state.activeExpanedRow === index ? "\ue601" : "\ue600"}
              </i>
            </div>
          ),
      },
    ];

    return (
      <div className={styles.container}>
        <h1 className={styles.pageHeader}>
          {i18n(lang, "PAGE_HEADER")}
          {blockId}
          <i className={cn("iconfont", styles["prev"])} onClick={this.onPrev}>
            &#xe613;
          </i>
          <i className={cn("iconfont", styles["next"])} onClick={this.onNext}>
            &#xe610;
          </i>
        </h1>
        <Row className={styles.blockInfo}>
          <Col lg={8}>
            <h4>{i18n(lang, "BLOCK_HEIGHT")}</h4>
          </Col>
          <Col lg={16}>{blockId}</Col>
          <Col lg={8}>
            <h4>{i18n(lang, "NEW_MERKLE_ROOT")}</h4>
          </Col>
          <Col lg={16}>{blockInfo.new_root}</Col>
          <Col lg={8}>
            <h4>{i18n(lang, "BLOCK_TIME")}</h4>
          </Col>
          <Col lg={16}>
            {blockInfo.created_time &&
              dayjsLocal(blockInfo.created_time).format("YYYY/MM/DD HH:mm:ss")}
          </Col>
          <Col lg={8}>
            <h4>{i18n(lang, "TX_NUMBER")}</h4>
          </Col>
          <Col lg={16}>{blockInfo.tx_num}</Col>
          <Col lg={8}>
            <h4>{i18n(lang, "REAL_TX_NUM")}</h4>
          </Col>
          <Col lg={16}>{blockInfo.real_tx_num}</Col>
          <Col lg={8}>
            <h4>{i18n(lang, "BLOCK_STATUS")}</h4>
          </Col>
          <Col lg={16}>{i18n(lang, blockInfo.status)}</Col>
          {blockInfo.status !== "UNCOMMITED" && (
            <>
              <Col lg={8}>
                <h4>{i18n(lang, "L1_TX_HASH")}</h4>
              </Col>
              <Col lg={16}>
                <a
                  href={`${NETWORK_BASE_URL}tx/${blockInfo.l1_tx_hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkText}
                >
                  {blockInfo.l1_tx_hash}
                </a>
              </Col>
            </>
          )}
        </Row>
        <Table2
          rowKey="id"
          dataSource={blockInfo.decoded_txs}
          columns={columns}
          classNames={{ wrap: styles.wrap, thead: styles.thead, td: styles.td }}
          loading={loading}
          expandedRowRender={this.renderExpandedRow}
          onRowKey={(item) => item.merkle_root}
        />
      </div>
    );
  }
}

const mapState = (state, props) => ({
  lang: state.lang,
  blockId: props.match.params.blockId,
});

export default connect(mapState)(BlockDetail);
