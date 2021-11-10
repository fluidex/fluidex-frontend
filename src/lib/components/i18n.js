const i18n = {
  FOOTER: {
    HELP: { en: "Support", zh: "帮助" },
    PRIVACY: { en: "Privacy", zh: "隐私" },
    FEE: { en: "Fee", zh: "费率" },
    GETLISTED: { en: "Get Listed", zh: "上币申请" },
    TERMS: { en: "Terms", zh: "条款" },
    CONTACT_US: { en: "Contact", zh: "联系我们" },
    COPYRIGHT1: {
      en: "FluiDex is wholly owned and operated by FluiDex Limited, a Cayman Islands incorporated entity or its relevant authorized affiliates.",
      zh: "FluiDex 由 FluiDex Limited（一家开曼群岛公司或其相关授权分支机构）全资拥有和经营。",
    },
    COPYRIGHT2: {
      en: "Copyright © 2021 FluiDex. All rights reserved.",
      zh: "Copyright © 2021 FluiDex. All rights reserved.",
    },
  },

  TRANSFER: {
    AVAILABLE: { en: "Available", zh: "可用" },
    EXCHANGE_ACCOUNT: { en: "Wallet Account", zh: "钱包账户" },
    ALL: { en: "All", zh: "全部" },
    CONFIRM: { en: "Confirm", zh: "确认" },
  },
};

export const trans = (prefix = "", lan, name, ...args) => {
  let result;
  try {
    const source = prefix ? i18n[prefix][name] : i18n[name];
    result = source[lan] || source.en || source.zh;
  } catch (error) {
    result = name.split("_").slice(1).join(" ");
  }

  if (result && args.length) {
    result = result.replace(/\$\{.\}/g, [].shift.bind(args));
  }

  return result;
};

export default i18n;
