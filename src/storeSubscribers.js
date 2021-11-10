const makeHandleAddressChange = (store) => {
  let currentAddress = localStorage.getItem("address");
  if (currentAddress === "null") {
    currentAddress = null;
  }

  const updateLayer2AddressWhenAddressChanges = (
    previousAddress,
    currentAddress
  ) => {
    if (previousAddress !== currentAddress) {
      store.dispatch.ethereum.refreshLayer2Credentials();
    }
  };

  const updateLocalStorageWhenAddressChanges = (
    previousAddress,
    currentAddress
  ) => {
    if (previousAddress !== currentAddress) {
      localStorage.setItem("address", currentAddress);
    }
  };

  const handleAddressChanges = () => {
    let previousAddress = currentAddress;
    currentAddress = store.getState().ethereum.address;

    updateLayer2AddressWhenAddressChanges(previousAddress, currentAddress);
    updateLocalStorageWhenAddressChanges(previousAddress, currentAddress);
  };

  return handleAddressChanges;
};

const makeHandleLayer2AddressChanges = (store) => {
  let currentLayer2Address = null;

  const updateUserDetailsWhenLayer2AddressChanges = (
    previousLayer2Address,
    currentLayer2Address
  ) => {
    if (previousLayer2Address !== currentLayer2Address) {
      store.dispatch.user.initUser();
    }
  };

  const updateLocalStorageWhenLayer2AddressChanges = (
    previousLayer2Address,
    currentLayer2Address
  ) => {
    if (previousLayer2Address !== currentLayer2Address) {
      localStorage.setItem("layer2Address", currentLayer2Address);
    }
  };

  const handleLayer2AddressChange = () => {
    let previousLayer2Address = currentLayer2Address;
    currentLayer2Address = store.getState().ethereum.layer2Address;

    updateUserDetailsWhenLayer2AddressChanges(
      previousLayer2Address,
      currentLayer2Address
    );
    updateLocalStorageWhenLayer2AddressChanges(
      previousLayer2Address,
      currentLayer2Address
    );
  };

  return handleLayer2AddressChange;
};
const storeSubscribers = (store) => {
  store.subscribe(makeHandleAddressChange(store));
  store.subscribe(makeHandleLayer2AddressChanges(store));
};

export default storeSubscribers;
