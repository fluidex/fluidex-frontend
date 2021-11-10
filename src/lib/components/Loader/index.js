import classnames from "classnames";
import React from "react";
import style from "./style.less";

const Loader = ({ spinning }) => (
  <div className={classnames(style.loader, { [style.hidden]: !spinning })}>
    <div className={style.warpper}>
      <div className={style.inner} />
      <div className={style.text}>Loading...</div>
    </div>
  </div>
);

export default Loader;
