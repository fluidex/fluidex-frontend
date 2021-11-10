import { trans } from "@/i18n";
import store from "@/old_store";
import { Button } from "components";
import React from "react";
import styles from "./internelServerError.module.scss";

const i18n = (lang, ...args) => trans(null, lang, ...args);

function reloadPage() {
  window.location.reload();
}

export default function InternelServerError({ message = "", ...restProps }) {
  const { lang } = store.getState();

  return (
    <div className={styles.container} {...restProps}>
      <div className={styles.exception}>
        <div className={styles.imgBlock}>
          <div className={styles.imgEle}></div>
        </div>
        <div className={styles.content}>
          <div className={styles.desc}>
            {message || i18n(lang, "ERROR_SERVER_ERR")}
          </div>
          <div className={styles.actions}>
            <Button className={styles.retryBtn} onClick={reloadPage}>
              <span>{i18n(lang, "ERROR_RETRY")}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
