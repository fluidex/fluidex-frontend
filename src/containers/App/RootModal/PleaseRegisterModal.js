import { trans } from "@/i18n";
import { Modal } from "antd";
import { Button } from "components";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { NetworksEnum } from "@/models/user";

const i18n = (lang, ...args) => trans("PLEASE_REGISTER_MODAL", lang, ...args);

const PleaseRegisterModal = ({
  lang,
  onClose,
  network,
  registerMocknetUser,
  registerTestnetUser,
}) => {
  const handleRegisterButtonClick = useCallback(() => {
    if (network === NetworksEnum.Mocknet) {
      registerMocknetUser();
    } else {
      registerTestnetUser();
    }
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
  network: state.user.network,
});

const mapDispatchToProps = (dispatch) => ({
  registerMocknetUser: dispatch.user.registerMocknetUser,
  registerTestnetUser: dispatch.user.registerTestnetUser,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PleaseRegisterModal);
