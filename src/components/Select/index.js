import { Select as AntdSelect } from "antd";
import cn from "classnames";
import React from "react";
import styles from "./select.module.scss";

const Select = (props) => {
  const { className, children, ...restOfProps } = props;

  return (
    <AntdSelect className={cn(className, styles.select)} {...restOfProps}>
      {children}
    </AntdSelect>
  );
};

Select.Option = AntdSelect.Option;

export default Select;
