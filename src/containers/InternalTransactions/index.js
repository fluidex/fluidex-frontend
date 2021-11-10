import { getInternalTransactions } from "@/apis";
import { Table2, Toast } from "@/components";
import { trans } from "@/i18n";
import * as utils from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import styles from "./InternalTransactions.module.scss";

const i18n = (lang, ...args) => trans("INTERNAL_TRANSACTIONS", lang, ...args);

const InternalTransactions = ({ userId, lang }) => {
  const [transactions, setTransactions] = useState([]);

  const columns = useMemo(
    () => [
      {
        key: "time",
        title: i18n(lang, "TIME"),
        dataIndex: "time",
        render: (val) => utils.dayjsLocal(val).format("YYYY/MM/DD HH:mm:ss"),
      },
      {
        key: "user_from",
        title: i18n(lang, "FROM"),
        dataIndex: "user_from",
      },
      {
        key: "user_to",
        title: i18n(lang, "TO"),
        dataIndex: "user_to",
      },
      {
        key: "asset",
        title: i18n(lang, "ASSET"),
        dataIndex: "asset",
      },
      {
        key: "amount",
        title: i18n(lang, "AMOUNT"),
        dataIndex: "amount",
      },
    ],
    [lang]
  );

  useEffect(() => {
    if (!userId) {
      return;
    }
    getInternalTransactions()
      .then((response) => {
        setTransactions(response.data);
      })
      .catch(() => {
        Toast.error(i18n(lang, "FETCH_FAILED"));
      });
  }, [userId]);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{i18n(lang, "SITE_TITLE")} | FluiDex</title>
      </Helmet>
      <h1 className={styles.pageHeader}>{i18n(lang, "PAGE_HEADER")}</h1>
      <Table2
        dataSource={transactions}
        columns={columns}
        onChange={() => {}}
        onRowKey={(item) => item.currency}
        pagination={{ total: 0, current: 1, limit: 1 }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  lang: state.lang,
  userId: state.user.id,
});

export default connect(mapStateToProps)(InternalTransactions);
