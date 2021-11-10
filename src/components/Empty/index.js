import { trans } from "@/i18n";
import store from "@/old_store";
import cn from "classnames";
import React from "react";
import styles from "./empty.module.scss";

export default function Empty(props) {
  const lang = store.getState().lang;
  const size = props.size || "default";
  const { className, ...restProps } = props;

  return (
    <div className={cn(styles.wrap, styles[size], className)} {...restProps}>
      <div className={styles.box}>
        <div className={styles.image}>
          <i className={cn("iconfont", styles.icon)}>&#xe620;</i>
        </div>
        <div className={styles.text}>
          {props.tip || trans(null, lang, "ALERT_EMPTY")}
        </div>
      </div>
    </div>
  );
}
