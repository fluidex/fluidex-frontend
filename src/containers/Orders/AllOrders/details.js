import { trans } from "@/i18n";
import store from "@/old_store";
import * as utils from "@/utils";
import { Spin } from "components";
import React from "react";
const i18n = (lang, ...args) => trans("ALL_ORDER", lang, ...args);

function renderDetails(list = []) {
  const lang = store.getState().lang;
  const items = [];
  list.forEach((item, i) => {
    items.push(
      <tr key={item.trade_id}>
        <td width="200">
          <span style={{ whiteSpace: "nowrap" }}>
            {utils.dayjsLocal(item.time).format("YYYY/MM/DD HH:mm:ss")}
          </span>
        </td>
        <td>
          {" "}
          {utils.subStringNum(item.price, 6) ||
            i18n(lang, "COL_MARKET_PRICE")}{" "}
        </td>
        <td> {utils.subStringNum(item.amount, 6) || "-"} </td>
        <td> {utils.subStringNum(item.quote_amount, 6) || "-"} </td>
        <td> {Number(item.fee).toFixed(8) || "-"} </td>
      </tr>
    );
  });
  return items;
}

export default function Details(props) {
  const lang = store.getState().lang;
  const loading = props.loading;
  const data = props.data || { trades: [] };
  return (
    <Spin loading={loading}>
      <table>
        <thead>
          <tr>
            <th width="200">{i18n(lang, "COL_CREATED_AT")}</th>
            <th>{i18n(lang, "COL_PRICE")}</th>
            <th>{i18n(lang, "COL_EXEC_VOLUME")}</th>
            <th>{i18n(lang, "COL_EXEC_AMOUNT")}</th>
            <th>{i18n(lang, "COL_FEE")}</th>
          </tr>
        </thead>
        <tbody>{renderDetails(data.trades)}</tbody>
      </table>
    </Spin>
  );
}
