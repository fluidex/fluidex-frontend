import cn from "classnames";
import React, { Component } from "react";
import styles from "./pagination.module.scss";

class Pagination extends Component {
  static defaultProps = {
    current: 1,
    total: 1,
    limit: 20,
    onChange: () => {},
  };

  onFirst = () => {
    const { current } = this.props;
    if (current > 1) {
      this.props.onChange(1);
    }
  };

  onPrev = () => {
    const { current } = this.props;
    if (current > 1) {
      this.props.onChange(current - 1);
    }
  };

  onNext = () => {
    const { current, total, limit } = this.props;
    if (current < Math.ceil(total / limit)) {
      this.props.onChange(current + 1);
    }
  };

  onLast = () => {
    const { current, total, limit } = this.props;
    const pageSize = Math.ceil(total / limit);

    if (current < pageSize) {
      this.props.onChange(pageSize);
    }
  };

  render() {
    const { current, total, limit, size } = this.props;
    const pageSize = Math.ceil(total / limit);
    const isFirstPage = current === 1;
    const isLastPage = current === pageSize;

    return (
      <div className={cn(styles["pagination-box"], styles[size])}>
        <i
          className={cn(
            "iconfont",
            styles["first"],
            isFirstPage && styles.gray
          )}
          onClick={this.onFirst}
        >
          &#xe60f;
        </i>
        <i
          className={cn("iconfont", styles["prev"], isFirstPage && styles.gray)}
          onClick={this.onPrev}
        >
          &#xe613;
        </i>
        <p>
          <span>{current}</span>
          <span>/</span>
          <span>{pageSize ? pageSize : 1}</span>
        </p>
        <i
          className={cn("iconfont", styles["next"], isLastPage && styles.gray)}
          onClick={this.onNext}
        >
          &#xe610;
        </i>
        <i
          className={cn("iconfont", styles["last"], isLastPage && styles.gray)}
          onClick={this.onLast}
        >
          &#xe60d;
        </i>
      </div>
    );
  }
}

export default Pagination;
