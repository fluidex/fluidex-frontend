import { trans } from "@/i18n";
import { Modal } from "antd";
import { Button } from "components";
import React, { useCallback } from "react";
import { connect } from "react-redux";

const i18n = (lang, ...args) => trans("PLEASE_REGISTER_MODAL", lang, ...args);
const TestnetsEnum = Object.freeze({
  Mainnet: "1",
  Kovan: "42",
  Ropsten: "3",
  Rinkeby: "4",
  Goerli: "5",
});

const PleaseRegisterModal = ({
  lang,
  onClose,
  testnet,
  registerUser,
  registerGoerliUser,
}) => {
  const handleRegisterButtonClick = useCallback(() => {
    if (testnet === TestnetsEnum.Goerli) {
      registerGoerliUser();
    } else {
      registerUser();
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
  testnet: state.user.testnet,
});

const mapDispatchToProps = (dispatch) => ({
  registerUser: dispatch.user.registerUser,
  registerGoerliUser: dispatch.user.registerGoerliUser,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PleaseRegisterModal);
