import { Toast } from "@/components";
import FluidexAbi from "@/contracts/Fluidex.json";
import { trans } from "@/i18n";
import { Account, get_CREATE_L2_ACCOUNT_MSG } from "fluidex.js";
import Web3 from "web3";

const i18n = (lang, ...args) => trans("MODEL_ETHEREUM", lang, ...args);

// Set this to the Fluidex contract address.
const fluidexAbiContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// MetaMask injects its API to window.ethereum. A local reference makes it less ugly.
// Note: only when state.hasMetaMask is true will this exist.
let metamask = null;
let web3 = null;
let fluidexContract = null;

let savedAddress = localStorage.getItem("address");
if (savedAddress === "null") {
  savedAddress = null;
}
let savedLayer2Address = localStorage.getItem("layer2Address");
if (savedLayer2Address === "null") {
  savedLayer2Address = null;
}

export const getIsConnected = (ethereum) => Boolean(ethereum.address);

const ethereum = {
  state: {
    hasMetaMask: false,
    address: savedAddress,
    layer2Address: null,
    layer2Signature: null,
    hasWeb3: false,
    hasFluidexContract: false,
    currentNetwork: null,
  },
  reducers: {
    setEthereum: (state, payload) => ({ ...state, ...payload }),
  },
  effects: (dispatch) => ({
    clearAddress() {
      this.setEthereum({ address: null });
    },
    clearLayer2Credentials() {
      this.setEthereum({ layer2Address: null, layer2Signature: null });
    },
    initialiseEthereum(payload, { lang }) {
      dispatch.ethereum.subscribeToWalletAccountChanged();
      dispatch.ethereum.subscribeToChainChanged();
      dispatch.ethereum.initialiseWeb3();
      dispatch.ethereum.initialiseContracts();
      dispatch.ethereum.tryGettingConnectedMetaMaskAccount().then((address) => {
        // The layer 1 address from MetaMask is the only trusted client verification.
        // The layer 2 address is the user identification token.
        // Only honour stored layer 2 address when the stored layer 1 address is confirmed by MetaMask.
        // In all other cases, drop any existing addresses.
        // Also see storeSubscribers. Layer 2 address defaults to null here and there. This prevents the case
        // where, layer 1 address is null but layer 2 address is not null in localStorage from being acknowledged.
        if (savedAddress && address === savedAddress) {
          const newState = { address };
          if (savedLayer2Address) {
            newState.layer2Address = savedLayer2Address;
          } else {
            // Handle the case where L1 address exists, but L2 address doesn't.
            dispatch.user.checkAuthorizationAndMaybeShowModal({
              locallyStoredCredentialsOnly: true,
            });
          }
          this.setEthereum(newState);
        } else {
          dispatch.ethereum.clearAddress();
          if (savedLayer2Address) {
            localStorage.setItem("layer2Address", null);
          }

          if (savedAddress) {
            Toast.error(i18n(lang, "PLEASE_RECONNECT"));
          }
        }
      });
    },
    checkEnvironmentHasMetaMask(payload, { lang }) {
      // True means ethereum-compatible plugins detected, and that the plugin is MetaMask.
      if (window.ethereum && window.ethereum.isMetaMask) {
        metamask = window.ethereum;
        this.setEthereum({ hasMetaMask: true });
        return;
      }
      // If there are no MetaMask, clear all addresses and display an error.
      dispatch.ethereum.clearAddress();
      if (savedLayer2Address) {
        localStorage.setItem("layer2Address", null);
      }
      Toast.error(i18n(lang, "PLEASE_INSTALL_METAMASK"), Toast.LONG);
    },
    requestMetaMaskForAccounts(payload, { ethereum }) {
      if (!ethereum.hasMetaMask) {
        return Promise.reject("MetaMask is not detected.");
      }

      if (payload !== "eth_accounts" && payload !== "eth_requestAccounts") {
        return Promise.reject(
          "The provided method is not a valid RPC method for requesting accounts."
        );
      }

      return metamask.request({ method: payload }).then((accounts) => {
        if (accounts.length) {
          // Note: as of 16/03/2021, even there are multiple accounted connected,
          // there is only one "active" account returned from MetaMask (as expected by us).
          return accounts[0];
        }
        return null;
      });
    },
    tryGettingConnectedMetaMaskAccount() {
      return dispatch.ethereum.requestMetaMaskForAccounts("eth_accounts");
    },
    async switchEthereumChain(chainId) {
      try {
        await metamask.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      } catch (switchError) {
        Toast.loading(switchError.message, Toast.LONG);
        // This error code indicates that the chain has not been added to MetaMask.
        // handle other "switch" errors
      }
    },
    tryConnectingToMetaMask() {
      return dispatch.ethereum
        .requestMetaMaskForAccounts("eth_requestAccounts")
        .then((address) => {
          if (address) {
            this.setEthereum({ address });
          }
        });
    },
    subscribeToWalletAccountChanged(payload, { ethereum, lang }) {
      if (!ethereum.hasMetaMask) {
        console.error("MetaMask is not detected.");
        return;
      }
      metamask.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          dispatch.ethereum.clearAddress();
        } else {
          Toast.loading(i18n(lang, "PLEASE_SIGN_LAYER2_ADDRESS"), Toast.LONG);
          this.setEthereum({ address: accounts[0] });
        }
      });
    },
    subscribeToChainChanged(payload, { ethereum, lang }) {
      if (!ethereum.hasMetaMask) {
        console.error("MetaMask is not detected.");
        return;
      }
      this.setEthereum({ currentNetwork: metamask.chainId });
      metamask.on("chainChanged", (chainId) => {
        this.setEthereum({ currentNetwork: chainId });
        Toast.loading(i18n(lang, "PLEASE_SIGN_LAYER2_ADDRESS"), Toast.LONG);
        dispatch.ethereum.refreshLayer2Credentials();
      });
    },
    initialiseWeb3(payload, { ethereum }) {
      if (!ethereum.hasMetaMask) {
        console.error("MetaMask is not detected.");
        return;
      }
      web3 = new Web3(metamask);
      this.setEthereum({ hasWeb3: true });
    },
    initialiseContracts(payload, { ethereum }) {
      if (!ethereum.hasWeb3) {
        console.error(
          "Web3 is not configured. Check if MetaMask is installed."
        );
        return;
      }

      if (FluidexAbi.abi && fluidexAbiContractAddress) {
        fluidexContract = new web3.eth.Contract(
          FluidexAbi.abi,
          fluidexAbiContractAddress
        );
        fluidexContract.setProvider(web3.currentProvider);
        this.setEthereum({ hasFluidexContract: true });
      }
    },
    depositEth(payload, { ethereum }) {
      if (!ethereum.hasFluidexContract) {
        console.error(
          "Fluidex contract is not configured. Check if MetaMask is installed."
        );
        return;
      }
      if (!ethereum.address) {
        console.error(
          "No wallet address detected in MetaMask. Check if MetaMask has been linked to a wallet."
        );
        return;
      }
      return fluidexContract.methods.depositETH(ethereum.address).send({
        from: ethereum.address,
        value: web3.utils.toWei(String(payload)),
      });
    },
    addToken(payload, { ethereum }) {
      if (!ethereum.hasFluidexContract) {
        console.error(
          "Fluidex contract is not configured. Check if MetaMask is installed."
        );
        return;
      }
      if (!ethereum.address) {
        console.error(
          "No wallet address detected in MetaMask. Check if MetaMask has been linked to a wallet."
        );
        return;
      }
      return fluidexContract.methods
        .addToken(payload)
        .send({ from: ethereum.address });
    },
    /**
     * Refreshing layer 2 credentials, including the address and the signature.
     *
     * A MetaMask popup will show up asking the user to sign a message for computing such credentials.
     *
     * @param {object} [payload] Configuration object. Supported properties:
     *    - `preserveExistingCredentials`: whether cleaning existing credentials is not necessary.
     *    Defaults to `false`.
     */
    refreshLayer2Credentials(
      { preserveExistingCredentials = false } = {},
      { ethereum }
    ) {
      if (!preserveExistingCredentials) {
        dispatch.ethereum.clearLayer2Credentials();
      }

      if (!ethereum.address) {
        console.error(
          "L1 address is needed for computing layer 2 credentials."
        );
        return null;
      }

      if (!ethereum.hasMetaMask) {
        console.error("MetaMask is not detected.");
        return null;
      }
      if (!ethereum.hasWeb3) {
        console.error(
          "Web3 is not configured. Check if MetaMask is installed."
        );
        return null;
      }

      const chainId = web3.utils.hexToNumber(metamask.chainId);
      return web3.eth.personal.sign(
        get_CREATE_L2_ACCOUNT_MSG(chainId),
        ethereum.address,
        (error, signature) => {
          if (error) {
            Toast.error(error.message);
            // If there is an address and L2 address was not generated, clear the existing address.
            dispatch.ethereum.clearAddress();
            dispatch.ethereum.clearLayer2Credentials();
            return;
          }
          const account = Account.fromSignature(signature, chainId);
          this.setEthereum({
            layer2Address: account.bjjPubKey,
            layer2Signature: signature,
          });
        }
      );
    },
  }),
  selectors: (slice) => ({
    isConnected() {
      return slice(getIsConnected);
    },
  }),
};

export default ethereum;
