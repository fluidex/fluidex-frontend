import { trans } from "@/i18n";
import { Modal } from "antd";
import { Button } from "components";
import React, { useCallback } from "react";
import { connect } from "react-redux";

const i18n = (lang, ...args) => trans("PLEASE_REGISTER_MODAL", lang, ...args);

const PleaseRegisterModal = ({ lang, onClose, registerUser }) => {
  const handleRegisterButtonClick = useCallback(() => {
    registerUser();
    onClose();
  }, []);

  const footer = (
    <Button onClick={handleRegisterButtonClick}>
      {i18n(lang, "MODAL_BUTTON_TEXT")}
    </Button>
  );

  return (
    <Modal
      visible
      title={i18n(lang, "MODAL_TITLE")}
      onCancel={onClose}
      footer={footer}
    >
      {i18n(lang, "MODAL_CONTENT")}
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  lang: state.lang,
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: dispatch.user.registerUser,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PleaseRegisterModal);
