import { Toast } from "@/components";
import { trans } from "@/i18n";
import { getUserDetails, registerUser } from "../apis";
import { getIsConnected } from "./ethereum";
import { MODAL_TYPE } from "./rootModal";

const defaultState = {
  id: null,
  displayedName: null,
  testnet: process.env.REACT_APP_TESTNET,
};

export const UNAUTHORIZED_STATES = {
  NOT_CONNECTED: "notConnected",
};

const getIsRegistered = (user) => Number.isInteger(user.id);
const user = {
  state: { ...defaultState },
  reducers: {
    setDetails: (state, payload) => ({ ...state, ...payload }),
    setTestnet: (state, testnet) => ({ ...state, testnet }),
  },
  effects: (dispatch) => ({
    initUser(payload, { ethereum }) {
      const layer2Address = ethereum.layer2Address;

      if (layer2Address) {
        getUserDetails(layer2Address).then(({ data }) => {
          if (data.error) {
            dispatch.user.setDetails({
              ...defaultState,
            });
            // If the user has a L2 address but we couldn't find their account details,
            // ask them to register an account.
            dispatch.rootModal.showModal({
              modalType: MODAL_TYPE.PLEASE_REGISTER_MODAL,
            });
            return;
          }

          dispatch.user.setDetails({
            id: data.id,
          });
        });
      } else {
        dispatch.user.setDetails({
          ...defaultState,
        });
      }
    },
    registerGoerliUser(payload, { lang }) {
      Toast.error(trans("PLEASE_REGISTER_MODAL", lang, "NOT_SUPPORTED_YET"));
      dispatch.user.setDetails({
        ...defaultState,
      });
    },
    registerUser(payload, { ethereum, lang }) {
      const address = ethereum.address;
      const layer2Address = ethereum.layer2Address;
      if (address && layer2Address) {
        // The way this API returns an error is different to that of the others.
        // Usually, we get a 200 response, and we check for data.error from the response.
        registerUser({ address, layer2Address })
          .then(({ data }) => {
            dispatch.user.setDetails({
              id: data.user_id,
            });

            Toast.success(trans("", lang, "REGISTRATION_SUCCESS_TOAST"));
          })
          .catch((error) => {
            if (error.response) {
              Toast.error(error.response.data.message);
              dispatch.user.setDetails({
                ...defaultState,
              });
            }
          });
      } else {
        dispatch.user.setDetails({
          ...defaultState,
        });
      }
    },
    checkAuthorizationAndMaybeShowModal(
      { locallyStoredCredentialsOnly = false } = {},
      { user, ethereum }
    ) {
      let rootModalType = "";
      if (!getIsConnected(ethereum)) {
        rootModalType = MODAL_TYPE.UNAUTHORIZED_MODAL;
      } else if (!ethereum.layer2Address) {
        rootModalType = MODAL_TYPE.PLEASE_SIGN_LAYER2_MODAL;
      } else if (!locallyStoredCredentialsOnly) {
        if (!getIsRegistered(user)) {
          rootModalType = MODAL_TYPE.PLEASE_REGISTER_MODAL;
        } else if (!ethereum.layer2Signature) {
          rootModalType = MODAL_TYPE.PLEASE_SIGN_LAYER2_MODAL;
        }
      }

      if (rootModalType) {
        dispatch.rootModal.showModal({ modalType: rootModalType });
        return false;
      }

      return true;
    },
  }),
  selectors: (slice, createSelector) => ({
    fullDetails(models) {
      return createSelector(
        slice,
        this.isRegistered,
        this.unauthorizedState,
        (rootState) => rootState.ethereum,
        models.ethereum.isConnected,
        (
          user,
          isRegistered,
          unauthorizedState,
          { address, layer2Address },
          isConnected
        ) => ({
          ...user,
          displayedName: user.displayedName || address,
          address,
          layer2Address,
          isRegistered,
          isConnected,
          unauthorizedState,
        })
      );
    },
    isRegistered() {
      return slice(getIsRegistered);
    },
    // Keep its structure for now as we could add permissions in the future.
    unauthorizedState(models) {
      return createSelector(models.ethereum.isConnected, (isConnected) => {
        let unauthorizedState = "";
        if (!isConnected) {
          unauthorizedState = UNAUTHORIZED_STATES.NOT_CONNECTED;
        }
        return unauthorizedState;
      });
    },
  }),
};
export default user;
