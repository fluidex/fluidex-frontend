import { trans } from "@/i18n";
import cn from "classnames";
import React, { PureComponent } from "react";
import styles from "./notice.module.scss";
const i18n = (lang, ...args) => trans("EXCHANGE_NOTICE", lang, ...args);

class Notice extends PureComponent {
  state = {
    list: [
      {
        id: 1,
        name_zh: "帮助中心",
        name_en: "Guide & Support",
        link_zh: "https://fluidex.zendesk.com/hc/zh-cn",
        link_en: "https://fluidex.zendesk.com/hc/en-us",
      },
      {
        id: 2,
        name_zh: "FluiDex 2.0 数字资产交易平台上线公告",
        name_en: "FluiDex 2.0 Digital Asset Trading Platform Official Launch",
        link_zh: "https://fluidex.zendesk.com/hc/zh-cn/articles/",
        link_en: "https://fluidex.zendesk.com/hc/en-us/articles/",
      },
    ],
  };

  componentWillUnmount() {
    this.abortRequest && this.abortRequest();
  }

  componentDidMount() {
    // apis.getNotices('en-us', {
    //   cancelToken: new axios.CancelToken(cancel => {
    //     this.abortRequest = cancel
    //   })
    // }).then(result => {
    //   this.setState({ list: result.data.sections })
    // }).catch(err => {
    //   console.log('err:', err)
    // })
  }

  render() {
    const { lang } = this.props;
    const { list } = this.state;

    return (
      <div className={cn(styles.noticeWrap, this.props.className)}>
        <a
          href="https://fluidex.zendesk.com"
          target="_blank"
          rel="noreferrer"
          className={styles.moreBtn}
        >
          {i18n(lang, "MORE")}
        </a>
        <div className={styles.list}>
          <i className={cn("iconfont", styles.icon)}>&#xe61c;</i>
          {list.slice(0, 3).map((item) => (
            <div className={styles.notice} key={item.id}>
              <a href={item[`link_${lang}`]} target="_blank" rel="noreferrer">
                {item[`name_${lang}`]}
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Notice;
