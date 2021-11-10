const lang = {
  state: "en",
  reducers: {
    setLang: (state, payload) => {
      return payload || state;
    },
  },
};

export default lang;
