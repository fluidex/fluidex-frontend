import { trans } from "@/i18n";
import { Modal } from "antd";
import { Button } from "components";
import React, { useCallback } from "react";
import { connect } from "react-redux";

const i18n = (lang, ...args) =>
  trans("PLEASE_SIGN_LAYER2_MODAL", lang, ...args);

const PleaseSignLayer2Modal = ({ lang, onClose, refreshLayer2Credentials }) => {
  const handleSignButtonClick = useCallback(() => {
    refreshLayer2Credentials();
    onClose();
  }, []);

  const footer = (
    <Button onClick={handleSignButtonClick}>
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
  refreshLayer2Credentials: dispatch.ethereum.refreshLayer2Credentials,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PleaseSignLayer2Modal);
