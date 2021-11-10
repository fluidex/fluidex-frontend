import { getPair } from "@/utils";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./MarketSelect.module.scss";

const DropdownContent = ({ pairs }) => {
  return (
    <Menu className={styles.marketNameDropdown}>
      {pairs &&
        pairs.map((pair) => (
          <Menu.Item key={pair.name} className={styles.item}>
            <Link to={pair.name}>{getPair(pair.base, pair.quote).symbol}</Link>
          </Menu.Item>
        ))}
    </Menu>
  );
};

const MarketSelect = ({ coinPair, pairs }) => {
  return (
    <Dropdown overlay={DropdownContent({ pairs })}>
      <span className={styles.marketNameDropdownTrigger}>
        {coinPair.symbol} <DownOutlined />
      </span>
    </Dropdown>
  );
};

export default MarketSelect;
