import React, { Component } from "react";
import style from "./query.module.scss";

export default class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
    };
  }
  updateState = (e) => {
    this.setValue(e.target.value);
  };
  clearInput = () => {
    this.setValue("");
    this.myInput.focus();
  };
  setValue = (value) => {
    const { onChange } = this.props;
    this.setState({ data: value });
    onChange(value);
  };
  render() {
    return (
      <div className={style["query-container"]}>
        {!this.state.data && (
          <i className={style["query-search"]} type="search" />
        )}
        <input
          className={style["query-input"]}
          value={this.state.data}
          onChange={this.updateState}
          ref={(myInput) => (this.myInput = myInput)}
        ></input>
        {this.state.data && (
          <i
            className={style["query-close"]}
            onClick={this.clearInput}
            type="close"
          />
        )}
      </div>
    );
  }
}
