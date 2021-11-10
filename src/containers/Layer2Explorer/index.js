import { getLayer2ExplorerData } from "@/apis";
import { Table2, Toast } from "@/components";
import { trans } from "@/i18n";
import { dayjsLocal } from "@/utils";
import axios from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./Layer2Explorer.module.scss";

const i18n = (lang, ...args) => trans("LAYER_2_EXPLORER", lang, ...args);

const DEFAULT_PAGINATION_TOTAL = 0;
const DEFAULT_PAGINATION_CURRENT = 1;
const DEFAULT_PAGINATION_LIMIT = 15;
const AUTO_REFRESH_INTERVAL = 1000;

const Layer2Explorer = ({ lang }) => {
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({
    total: DEFAULT_PAGINATION_TOTAL,
    current: DEFAULT_PAGINATION_CURRENT,
    limit: DEFAULT_PAGINATION_LIMIT,
  });

  const cancelFetch = useRef(null);
  const fetch = () => {
    if (cancelFetch.current) {
      cancelFetch.current();
    }

    getLayer2ExplorerData({
      cancelToken: new axios.CancelToken((cancel) => {
        cancelFetch.current = cancel;
      }),
      params: {
        limit: tablePagination.limit,
        offset: (tablePagination.current - 1) * tablePagination.limit,
      },
    })
      .then((response) => {
        setTableData(response.data.blocks);
        setTablePagination((oldPagination) => ({
          ...oldPagination,
          total: Number(response.data.total),
        }));
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          Toast.error(i18n(lang, "FETCH_FAILED"));
        }
      })
      .finally(() => {
        cancelFetch.current = null;
      });
  };

  useEffect(fetch, []);

  const lastPaginationCurrent = useRef(tablePagination.current);
  useEffect(() => {
    if (tablePagination.current !== lastPaginationCurrent.current) {
      fetch();
    }
    lastPaginationCurrent.current = tablePagination.current;

    const internalId = setInterval(() => {
      if (!cancelFetch.current) {
        fetch();
      }
    }, AUTO_REFRESH_INTERVAL);
    return () => {
      clearInterval(internalId);
    };
  }, [tablePagination]);

  const columns = useMemo(
    () => [
      {
        key: "block_height",
        title: i18n(lang, "BLOCK_HEIGHT"),
        dataIndex: "block_height",
        render: (val) => <Link to={"/explorer/block/" + val}>{val}</Link>,
      },
      {
        key: "merkle_root",
        title: i18n(lang, "MERKLE_ROOT"),
        dataIndex: "merkle_root",
      },
      {
        key: "block_time",
        title: i18n(lang, "BLOCK_TIME"),
        dataIndex: "block_time",
        render: (val) => dayjsLocal(val).format("YYYY/MM/DD HH:mm:ss"),
      },
    ],
    [lang]
  );

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{i18n(lang, "SITE_TITLE")} | FluiDex</title>
      </Helmet>
      <h1 className={styles.pageHeader}>{i18n(lang, "PAGE_HEADER")}</h1>
      <p className={styles.currentBestBlockHeight}>
        {i18n(lang, "CURRENT_BEST_BLOCK_HEIGHT")} {tablePagination.total}
      </p>
      <Table2
        dataSource={tableData}
        columns={columns}
        onChange={({ pagination }) => {
          setTablePagination({
            ...tablePagination,
            current: pagination.current,
          });
        }}
        onRowKey={(item) => item.merkle_root}
        pagination={tablePagination}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  lang: state.lang,
});

export default connect(mapStateToProps)(Layer2Explorer);
