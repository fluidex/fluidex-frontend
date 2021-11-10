import cn from "classnames";
import React, { Component } from "react";
import styles from "./input.module.scss";

export default class Input extends Component {
  static defaultProps = {
    disabled: false,
    block: false,
  };
  render() {
    const {
      className,
      disabled,
      block,
      size,
      int,
      numeric,
      onChange,
      ...restProps
    } = this.props;
    const inputClassName = cn(
      styles.input,
      className,
      disabled && styles.disabled,
      block && styles.block,
      size && styles[size]
    );

    const handleChange = (event) => {
      let processedValue = event.target.value;

      if (int) {
        const value = event.target.value.replace(/\D/g, "");
        processedValue = value;
      }

      if (numeric) {
        const value = parseFloat(event.target.value);
        if (!Number.isNaN(value) && String(value) === event.target.value) {
          processedValue = value;
        }
      }

      onChange(processedValue);
    };
    return (
      <input
        className={inputClassName}
        disabled={disabled}
        onChange={handleChange}
        {...restProps}
      />
    );
  }
}
