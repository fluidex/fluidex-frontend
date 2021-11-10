import classnames from "classnames";
import React from "react";
import { trans } from "../i18n";
// import QRCode from "qrcode.react";
import style from "./footer.module.less";

const i18n = (lang, ...args) => trans("FOOTER", lang, ...args);

export default function Footer(props) {
  const lang = props.lang || "en";
  const navlist = [
    {
      name: "HELP",
      zh: "https://fluidex.zendesk.com",
      en: "https://fluidex.zendesk.com",
    },
    {
      name: "TERMS",
      zh: "https://fluidex.me/terms",
      en: "https://fluidex.me/terms",
    },
    {
      name: "CONTACT_US",
      zh: "https://fluidex.zendesk.com/",
      en: "https://fluidex.zendesk.com/",
    },
  ];
  const navs =
    props.navs ||
    navlist.map((item) => (
      <a key={item.name} target="_blank" rel="noreferrer" href={item[lang]}>
        {i18n(lang, item.name)}
      </a>
    ));
  return (
    <div
      className={classnames(
        style["footer-wrapper"],
        props.responsive ? style.responsive : ""
      )}
    >
      <div className={style["container"]}>
        <div>
          <ul>
            {navs.map((child, idx) => (
              <li key={idx}>{child}</li>
            ))}
          </ul>
          <p>{i18n(lang, "COPYRIGHT1")}</p>
          <p>{i18n(lang, "COPYRIGHT2")}</p>
        </div>
        <div className={style["right"]}>
          {/* <div className={style['wechat-box']}>
            <img src={require('./assets/icon-wechat.png')} alt="" className={style['wechat-icon']}/>
            <QRCode value={wechatUrl} size={130} />
          </div> */}
          <a href="mailto:contact@fluidex.me">
            <img src={require("./assets/icon-email.png")} alt="" />
          </a>
          <a
            href="https://twitter.com/FluiDexOfficial"
            rel="noreferrer"
            target="_blank"
          >
            <img src={require("./assets/icon-twitter.png")} alt="" />
          </a>
          <a
            href="https://t.me/FluiDexOfficial"
            target="_blank"
            rel="noreferrer"
          >
            <img src={require("./assets/icon-telgram.png")} alt="" />
          </a>
          <a
            href="https://medium.com/@fluidex"
            target="_blank"
            rel="noreferrer"
          >
            <img src={require("./assets/icon-medium.png")} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}
