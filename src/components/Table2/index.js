import cn from "classnames";
import { Empty, Pagination, Spin } from "components";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import React, { Component } from "react";
import styles from "./table.module.scss";
const _noop = () => {};

export default class Table extends Component {
  static defaultProps = {
    classNames: {
      row: _noop,
      column: _noop,
    },
    loading: false,
    columns: [],
    dataSource: [],
    onSortByTime: _noop,
    size: "default",
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.dataSource !== this.props.dataSource) {
      let { sortColumn } = this.state;
      if (sortColumn) {
        this.sortColumn();
      } else {
        this.setState({
          data: this.props.dataSource,
        });
      }
    }
  }

  onSorter = (event) => {
    const { key } = event.currentTarget.dataset;
    // TODO: SUPPORT MULTIPLE COLUM
    this.props.onChange({
      pagination: this.props.pagination,
      sort: key,
    });
  };

  handlePageChange = (num) => {
    this.props.onChange({
      pagination: {
        ...this.props.pagination,
        current: num,
      },
    });
  };

  onRowKey = (item, index) => {
    return this.props.onRowKey(item) || index;
  };

  renderSorter(column) {
    const { prefixCls = "fluidex-table" } = this.props;
    const { sortOrder } = this.state;
    let isSortColumn = this.isSortColumn(column);
    const isAscend = isSortColumn && sortOrder === "ascend";
    const isDescend = isSortColumn && sortOrder === "descend";
    return (
      <div className={styles[`${prefixCls}-column-sorter`]}>
        <span className={styles["fluidex-table-column-sorter-inner"]}>
          <span
            className={cn(
              styles.fluidexicon,
              styles[`${prefixCls}-column-sorter-up`],
              isAscend ? styles.active : ""
            )}
            title="↑"
            onClick={() => this.toggleSortOrder("ascend", column)}
          >
            <CaretUpOutlined />
          </span>
          <span
            className={cn(
              styles.fluidexicon,
              styles[`${prefixCls}-column-sorter-down`],
              isDescend ? styles.active : ""
            )}
            title="↓"
            onClick={() => this.toggleSortOrder("descend", column)}
          >
            <CaretDownOutlined />
          </span>
        </span>
      </div>
    );
  }

  isSortColumn(column) {
    const { sortColumn } = this.state;
    if (!column || !sortColumn) {
      return false;
    }
    return this.getColumnKey(sortColumn) === this.getColumnKey(column);
  }

  getColumnKey(column, index) {
    return column.key || column.dataIndex || index;
  }

  toggleSortOrder(order, column) {
    let { sortColumn, sortOrder } = this.state;
    let isSortColumn = this.isSortColumn(column);
    if (!isSortColumn) {
      sortOrder = order;
      sortColumn = column;
    } else {
      if (sortOrder === order) {
        sortOrder = "";
        sortColumn = null;
      } else {
        sortOrder = order;
      }
    }
    const newState = {
      sortOrder,
      sortColumn,
    };

    this.setState(newState, () => {
      this.sortColumn();
    });
  }

  sortColumn() {
    const data = this.getLocalData();
    this.setState({
      data,
    });
  }

  getSortOrderColumns(columns) {
    return (columns || this.props.columns || []).filter(
      (column) => "sortOrder" in column
    );
  }

  recursiveSort(data, sorterFn) {
    const { childrenColumnName } = this.props;
    let a = data.sort(sorterFn);

    return data.sort(sorterFn).map((item) =>
      item[childrenColumnName]
        ? {
            ...item,
            [childrenColumnName]: this.recursiveSort(
              item[childrenColumnName],
              sorterFn
            ),
          }
        : item
    );
  }

  getLocalData() {
    const { dataSource } = this.props;
    let data = dataSource || [];
    data = data.slice(0);
    const sorterFn = this.getSorterFn();
    if (sorterFn) {
      data = this.recursiveSort(data, sorterFn);
    }
    return data;
  }

  getSorterFn() {
    const { sortOrder, sortColumn } = this.state;
    if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== "function") {
      return;
    }
    return (a, b) => {
      const result = sortColumn.sorter(a, b);
      if (result !== 0) {
        return sortOrder === "descend" ? -result : result;
      }
      return 0;
    };
  }

  render() {
    const {
      columns,
      classNames,
      expandedRowRender,
      pagination,
      footer,
      loading,
      size,
      dataSource,
    } = this.props;

    const { data } = this.state;

    return (
      <div className={cn(styles["table-container"], classNames.containers)}>
        <Spin loading={loading}>
          <div
            className={cn(
              styles["table-box"],
              footer && styles["footer"],
              classNames.wrap
            )}
          >
            <table
              cellSpacing="0"
              cellPadding="0"
              className={cn(styles.table, styles[size], classNames.table)}
            >
              <thead className={cn(styles.thead, classNames.thead)}>
                <tr className={styles.tr}>
                  {columns.map((item) => (
                    <th
                      key={item.key}
                      data-key={item.key}
                      className={cn(styles["th"], item.className)}
                      onClick={this.onSorter}
                    >
                      <div
                        className={styles["fluidex-table-column-sorters"]}
                        style={{ lineHeight: 0 }}
                      >
                        <span className={styles["fluidex-table-column-title"]}>
                          {item.title}
                        </span>
                        {item.sorter && this.renderSorter(item)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={cn(styles.tbody, classNames.tbody)}>
                {data.length !== 0 &&
                  data.map((item, idx) => {
                    return (
                      <React.Fragment key={item.id || this.onRowKey(item, idx)}>
                        <tr
                          key={(item.id || idx) + "-tr"}
                          className={`${cn(
                            styles.tr,
                            classNames.row && classNames.row(item)
                          )} ${item.type === "big" ? styles["big"] : ""}`}
                        >
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              style={{
                                textAlign: col.align || "center",
                                width: col.width,
                                ...col.styles,
                              }}
                              className={cn(
                                styles.td,
                                classNames.td,
                                classNames.column &&
                                  classNames.column(col, item)
                              )}
                            >
                              {col.render
                                ? col.dataIndex
                                  ? col.render(item[col.dataIndex], item, idx)
                                  : col.render(item, idx)
                                : item[col.dataIndex]}
                            </td>
                          ))}
                        </tr>
                        {expandedRowRender && (
                          <tr
                            key={item.id + "-expand"}
                            className={`${
                              item.type === "big" ? styles["big"] : ""
                            }`}
                          >
                            <td colSpan={columns.length}>
                              {expandedRowRender(item, idx)}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                {!loading && data.length === 0 && (
                  <tr>
                    <td colSpan={columns.length}>
                      <Empty size={size} />
                    </td>
                  </tr>
                )}
              </tbody>
              {footer && (
                <tfoot className={styles.tfoot}>
                  <tr>
                    <td colSpan={columns.length}>{footer}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Spin>
        {pagination && (
          <Pagination
            {...pagination}
            size={size}
            onChange={this.handlePageChange}
          />
        )}
      </div>
    );
  }
}
