import { Descriptions as AntdDescriptions } from "antd";
import cn from "classnames";
import React from "react";
import styles from "./descriptions.module.scss";

const Descriptions = (props) => {
  const { className, children, ...restOfProps } = props;

  return (
    <AntdDescriptions
      className={cn(className, styles.descriptions)}
      {...restOfProps}
    >
      {children}
    </AntdDescriptions>
  );
};

Descriptions.Item = AntdDescriptions.Item;

export default Descriptions;
