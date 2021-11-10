import { trans } from "@/i18n";
import store from "@/old_store";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Block.module.scss";
const i18n = (lang, ...args) => trans("LAYER_2_EXPLORER_DETAIL", lang, ...args);

const TYPE_MAP = {
  SPOT_TRADE: "SPOT_TRADE",
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  TRANSFER: "TRANSFER",
  NOP: "NOP",
};

function renderDepositTxDetail(deposit) {
  const lang = store.getState().lang;
  return (
    <table>
      <thead>
        <tr>
          <th>{i18n(lang, "ACCOUNT_ID")}</th>
          <th>{i18n(lang, "TOKEN")}</th>
          <th>{i18n(lang, "AMOUNT")}</th>
          <th>{i18n(lang, "OLD_BALANCE")}</th>
          <th>{i18n(lang, "NEW_BALANCE")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              to={`/explorer/account/${deposit.account_id}`}
              className={styles.linkText}
            >
              {deposit.account_id}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/token/${deposit.token_id}`}
              className={styles.linkText}
            >
              {deposit.token_id}
            </Link>
          </td>
          <td>{deposit.amount}</td>
          <td>{deposit.old_balance}</td>
          <td>{deposit.new_balance}</td>
        </tr>
      </tbody>
    </table>
  );
}

function renderSpotTradeTxDetail(spotTrade) {
  const lang = store.getState().lang;
  return (
    <table>
      <thead>
        <tr>
          <th>{i18n(lang, "ORDER1_ACCOUNT_ID")}</th>
          <th>{i18n(lang, "ORDER2_ACCOUNT_ID")}</th>
          <th>{i18n(lang, "TOKEN_ID_1_TO_2")}</th>
          <th>{i18n(lang, "TOKEN_ID_2_TO_1")}</th>
          <th>{i18n(lang, "AMOUNT_1TO2")}</th>
          <th>{i18n(lang, "AMOUNT_2TO1")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              to={`/explorer/account/${spotTrade.order1_account_id}`}
              className={styles.linkText}
            >
              {spotTrade.order1_account_id}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/account/${spotTrade.order2_account_id}`}
              className={styles.linkText}
            >
              {spotTrade.order2_account_id}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/token/${spotTrade.token_id_1to2}`}
              className={styles.linkText}
            >
              {spotTrade.token_id_1to2}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/token/${spotTrade.token_id_2to1}`}
              className={styles.linkText}
            >
              {spotTrade.token_id_2to1}
            </Link>
          </td>
          <td>{spotTrade.amount_1to2}</td>
          <td>{spotTrade.amount_2to1}</td>
        </tr>
      </tbody>
    </table>
  );
}

function renderWithdrawTxDetail(withdraw) {
  const lang = store.getState().lang;
  return (
    <table>
      <thead>
        <tr>
          <th>{i18n(lang, "ACCOUNT_ID")}</th>
          <th>{i18n(lang, "TOKEN_ID")}</th>
          <th>{i18n(lang, "AMOUNT")}</th>
          <th>{i18n(lang, "OLD_BALANCE")}</th>
          <th>{i18n(lang, "NEW_BALANCE")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              to={`/explorer/account/${withdraw.account_id}`}
              className={styles.linkText}
            >
              {withdraw.account_id}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/token/${withdraw.token_id}`}
              className={styles.linkText}
            >
              {withdraw.token_id}
            </Link>
          </td>
          <td>{withdraw.amount}</td>
          <td>{withdraw.old_balance}</td>
          <td>{withdraw.new_balance}</td>
        </tr>
      </tbody>
    </table>
  );
}

function renderTransferTxDetail(transfer) {
  const lang = store.getState().lang;
  return (
    <table>
      <thead>
        <tr>
          <th>{i18n(lang, "FROM")}</th>
          <th>{i18n(lang, "TO")}</th>
          <th>{i18n(lang, "TOKEN_ID")}</th>
          <th>{i18n(lang, "AMOUNT")}</th>
          <th>{i18n(lang, "OLD_BALANCE")}</th>
          <th>{i18n(lang, "NEW_BALANCE")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link
              to={`/explorer/account/${transfer.from}`}
              className={styles.linkText}
            >
              {transfer.from}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/account/${transfer.to}`}
              className={styles.linkText}
            >
              {transfer.to}
            </Link>
          </td>
          <td>
            <Link
              to={`/explorer/token/${transfer.token_id}`}
              className={styles.linkText}
            >
              {transfer.token_id}
            </Link>
          </td>
          <td>{transfer.amount}</td>
          <td>{transfer.old_balance}</td>
          <td>{transfer.new_balance}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default function Details(props) {
  const data = props.data || {};
  const type = data.type;
  if (type === TYPE_MAP.DEPOSIT) {
    return renderDepositTxDetail(data);
  }
  if (type === TYPE_MAP.SPOT_TRADE) {
    return renderSpotTradeTxDetail(data);
  }
  if (type === TYPE_MAP.WITHDRAW) {
    return renderWithdrawTxDetail(data);
  }
  if (type === TYPE_MAP.TRANSFER) {
    return renderTransferTxDetail(data);
  }
}
