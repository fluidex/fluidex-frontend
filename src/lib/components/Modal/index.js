import classnames from "classnames";
import Dialog from "rc-dialog";
import React, { Component } from "react";
import "./dialog.less";
import style from "./style.module.less";

export default class Modal extends Component {
  render() {
    const {
      visible = true,
      zIndex = 10,
      onClose,
      onBack,
      afterClose,
      hasClose = true,
      hasBack,
      maskClosable = false,
      title,
      children,
      DialogClass,
      className,
    } = this.props;
    return (
      <Dialog
        visible={visible}
        onClose={onClose}
        afterClose={afterClose}
        closable={false}
        zIndex={zIndex}
        maskClosable={maskClosable}
        WrapComponent="div"
        transitionName="rc-dialog-fade"
        maskTransitionName="rc-dialog-fade"
        className={classnames(style["modal-wrapper"], DialogClass)}
      >
        <div
          className={classnames(style["content-box"], className)}
          ref={(e) => (this.content = e)}
        >
          {title && <p className={style["title"]}>{title}</p>}
          {children}
        </div>
        {hasClose && <i className={style["icon-close"]} onClick={onClose}></i>}
        {hasBack && <i className={style["icon-back"]} onClick={onBack}></i>}
      </Dialog>
    );
  }
}
