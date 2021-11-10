import classnames from "classnames";
import Notification from "rc-notification";
import React from "react";
import styles from "./toast.module.scss";

let messageInstance;

function getMessageInstance(cb) {
  Notification.newInstance(
    {
      prefixCls: "toast",
      style: { top: 0 },
      transitionName: "fade",
    },
    (n) => {
      messageInstance = n;
      cb(messageInstance);
    }
  );
}

function notice(content, type, duration = 3, onClose) {
  if (typeof duration === "function") {
    onClose = duration;
    duration = 3;
  }

  getMessageInstance((instance) => {
    instance.notice({
      duration,
      style: {
        top: 65,
      },
      content: (
        <div className={classnames(styles["toast-text"], styles[type])}>
          {type === "html" ? (
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
          ) : (
            <div>{content}</div>
          )}
        </div>
      ),
      closable: true,
      onClose: () => {
        if (onClose) {
          onClose();
        }
        instance.destroy();
        instance = null;
        messageInstance = null;
      },
    });
  });
}

const Toast = {
  SHORT: 3,
  LONG: 8,
  warning(content, duration, onClose) {
    return notice(content, "warning", duration, onClose);
  },
  success(content, duration, onClose) {
    return notice(content, "success", duration, onClose);
  },
  error(content, duration, onClose) {
    return notice(content, "fail", duration, onClose);
  },
  loading(content, duration, onClose) {
    return notice(content, "loading", duration, onClose);
  },
  hide() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  },
};

export default Toast;
