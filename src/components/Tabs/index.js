import cn from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./tabs.module.scss";

function Tab(props) {
  const { className, children, ...restProps } = props;

  return (
    <div className={cn(styles.tab, className)} {...restProps}>
      {children}
    </div>
  );
}

function Tabs(props) {
  const { children, active, className, onChange, ...restProps } = props;

  useEffect(() => {
    setActiveTabIndex(0);
  }, [children.length]);

  const tabs = [];
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  if (typeof active === "number" && activeTabIndex !== active) {
    setActiveTabIndex(active);
  }

  const handleTabClick = (event) => {
    const clickedTabIndex = parseInt(event.currentTarget.dataset.index, 10);
    setActiveTabIndex(clickedTabIndex);

    const tabName = event.currentTarget.dataset.name;
    if (typeof onChange === "function") {
      onChange(tabName ? tabName : clickedTabIndex);
    }
  };

  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child) || child.type !== Tab) {
      return;
    }
    tabs.push(child);

    if (typeof active === "string") {
      if (child.props.name === active && activeTabIndex !== index) {
        setActiveTabIndex(index);
      }
    }
  });

  if (tabs.length === 0) {
    return;
  }

  return (
    <div className={cn(styles.tabs, className)} {...restProps}>
      {tabs.map((tab, index) => {
        const { name, className, disabled, ...restProps } = tab.props;
        return React.cloneElement(tab, {
          ...restProps,
          className: cn(
            className,
            styles.tab,
            activeTabIndex === index && styles.active,
            disabled ? styles.disabled : ""
          ),
          "data-index": index,
          "data-name": tab.props.name,
          onClick: disabled ? null : handleTabClick,
          key: tab.props.name || index,
        });
      })}
    </div>
  );
}

Tabs.Tab = Tab;
export default Tabs;
