import { MODAL_TYPE } from "@/models/rootModal";
import React from "react";
import { connect } from "react-redux";
import PleaseRegisterModal from "./PleaseRegisterModal";
import PleaseSignLayer2Modal from "./PleaseSignLayer2Modal";
import UnauthorizedModal from "./UnauthorizedModal";

const modalTypeToComponentMap = {
  [MODAL_TYPE.UNAUTHORIZED_MODAL]: UnauthorizedModal,
  [MODAL_TYPE.PLEASE_REGISTER_MODAL]: PleaseRegisterModal,
  [MODAL_TYPE.PLEASE_SIGN_LAYER2_MODAL]: PleaseSignLayer2Modal,
};

const RootModal = ({ modalType, modalProps, hideModal }) => {
  if (!modalTypeToComponentMap[modalType]) {
    return null;
  }

  const ChosenModal = modalTypeToComponentMap[modalType];
  return <ChosenModal {...modalProps} onClose={hideModal} />;
};

const mapStateToProps = (state) => ({
  modalType: state.rootModal.modalType,
  modalProps: state.rootModal.modalProps,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: dispatch.rootModal.hideModal,
});

export default connect(mapStateToProps, mapDispatchToProps)(RootModal);
