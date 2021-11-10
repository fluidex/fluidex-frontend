const defaultState = {
  modalType: null,
  modalProps: undefined,
};

export const MODAL_TYPE = Object.freeze({
  UNAUTHORIZED_MODAL: "UNAUTHORIZED_MODAL",
  PLEASE_REGISTER_MODAL: "PLEASE_REGISTER_MODAL",
  PLEASE_SIGN_LAYER2_MODAL: "PLEASE_SIGN_LAYER2_MODAL",
});

export const MODAL_TYPES = Object.freeze(Object.keys(MODAL_TYPE));

const rootModal = {
  state: { ...defaultState },
  reducers: {
    setShowModal: (state, payload) => ({
      modalType: payload.modalType,
      modalProps: payload.modalProps,
    }),
    setHideModal: (state, payload) => ({ ...defaultState }),
  },
  effects: (dispatch) => ({
    showModal(payload, rootState) {
      if (MODAL_TYPES.includes(payload.modalType)) {
        this.setShowModal(payload);
      } else {
        console.error(
          `Trying to show root modal with an unrecognised modal type: ${payload.modalType}`
        );
      }
    },
    hideModal(payload, { rootModal }) {
      if (rootModal.modalType) {
        this.setHideModal();
      } else {
        console.warn("Trying to hide the root modal but it is not shown.");
      }
    },
  }),
};

export default rootModal;
