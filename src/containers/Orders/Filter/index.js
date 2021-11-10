import { trans } from "@/i18n";
import { DatePicker, Form, Select } from "antd";
import { Button } from "components";
import React, { Component } from "react";
import styles from "./filter.module.scss";
const i18n = (lang, ...args) => trans("ALL_ORDER", lang, ...args);

class Filter extends Component {
  formRef = React.createRef();

  handleFilterChange = (field) => (value) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [field]: value,
      },
    });
  };

  searchHandler = () => {
    this.setState({ loading: true });
    this.fetch();
  };

  resetFilter = () => {
    const { resetFields } = this.formRef.current;
    resetFields();

    this.props.onSubmit({});
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const fields = this.props.form.getFieldsValue();

    if (!Object.keys(fields).length) {
      return;
    }

    if (fields.range && fields.range.length) {
      fields.time_from = fields.range[0].startOf("day").unix();
      fields.time_to = fields.range[1].startOf("day").unix();
      fields.range = null;
    }

    this.props.onSubmit(fields);
  };

  render() {
    const { lang, showRange } = this.props;

    return (
      <Form onFinish={this.handleSubmit} ref={this.formRef}>
        <div className={styles.filter}>
          {showRange && (
            <div className={styles.item}>
              <div className={styles.itemTit}>{i18n(lang, "FILTER_TIME")}</div>
              <Form.Item noStyle name="range">
                <DatePicker.RangePicker
                  format="YYYY/MM/DD"
                  placeholder={[
                    i18n(lang, "FILTER_TIME_START"),
                    i18n(lang, "FILTER_TIME_END"),
                  ]}
                />
              </Form.Item>
            </div>
          )}
          {/*
          <div className={styles.item}>
            <div className={styles.itemTit}>{i18n(lang, 'FILTER_MARKET')}</div>
            {getFieldDecorator('market')(
              <Select style={{ width: 120 }} placeholder={i18n(lang, 'FILTER_SELECT')}>
                {
                  pairs.list.map(market => (
                    <Select.Option key={market.id} value={market.id}>{market.name}</Select.Option>
                  ))
                }
              </Select>
            )}

          </div>
	  */}
          {/* <div className={styles.item}>
            <div className={styles.itemTit}>{i18n(lang, 'FILTER_ORDER_TYPE')}</div>
            {getFieldDecorator('ord_type')(
              <Select style={{ width: 120 }} placeholder={i18n(lang, 'FILTER_SELECT')}>
                <Select.Option value="limit">Limit</Select.Option>
                <Select.Option value="market">Market</Select.Option>
              </Select>
            )}
          </div> */}
          <div className={styles.item}>
            <div className={styles.itemTit}>{i18n(lang, "FILTER_SIDE")}</div>
            <Form.Item noStyle name="type">
              <Select
                style={{ width: 120 }}
                placeholder={i18n(lang, "FILTER_SELECT")}
              >
                <Select.Option value="sell">SELL</Select.Option>
                <Select.Option value="buy">BUY</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className={styles.item} style={{ marginLeft: 20 }}>
            <Button.Group disabled>
              <Button
                key="submit"
                className={styles.submitBtn}
                htmlType="submit"
              >
                {i18n(lang, "FILTER_SUBMIT")}
              </Button>
              <Button
                key="reset"
                className={styles.resetBtn}
                onClick={this.resetFilter}
              >
                {i18n(lang, "FILTER_RESET")}
              </Button>
            </Button.Group>
          </div>
        </div>
      </Form>
    );
  }
}

export default Filter;
