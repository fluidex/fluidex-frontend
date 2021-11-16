const i18n = {
  ERROR_RETRY: { en: "Retry", zh: "重试" },
  ERROR_SERVER_ERR: { en: "Internel Server Error", zh: "抱歉，服务器出错了" },
  ALERT_EMPTY: { en: "No data", zh: "暂无数据" },
  ALERT_INVALID_NUM: {
    en: "Please enter the correct number",
    zh: "请输入正确数字",
  },
  UNAUTHORIZED_MODAL: {
    NOT_CONNECTED_TITLE: {
      en: "App not connected to wallet",
      zh: "未连接到钱包",
    },
    NOT_CONNECTED_CONTENT: {
      en: "Please connect the app to your wallet before proceeding",
      zh: "请连接钱包再执行下一步操作",
    },
  },
  PLEASE_REGISTER_MODAL: {
    MODAL_TITLE: { en: "You have not registered", zh: "未注册" },
    MODAL_CONTENT: {
      en: "Please register before proceeding",
      zh: "请注册后再执行下一步操作",
    },
    NOT_SUPPORTED_YET: {
      en: "Not supported yet",
      zh: "暂不支持",
    },
    MODAL_BUTTON_TEXT: {
      en: "Register",
      zh: "注册",
    },
  },
  PLEASE_SIGN_LAYER2_MODAL: {
    MODAL_TITLE: {
      en: "You have not signed your layer 2 signature",
      zh: "未签署二层签名",
    },
    MODAL_CONTENT: {
      en: "Please sign your layer 2 signature before proceeding",
      zh: "请签署二层签名后再执行下一步操作",
    },
    MODAL_BUTTON_TEXT: {
      en: "Sign",
      zh: "签署",
    },
  },

  REGISTRATION_SUCCESS_TOAST: {
    en: "You have successfully registered and have been granted 10000 mock USDTs!",
    zh: "注册成功！系统已发放给您 10000 USDT 模拟币以供测试使用！",
  },

  STATE: {
    confirming: { en: "Confirming", zh: "确认中" },
    completed: { en: "Completed", zh: "已完成" },
    reviewing: { en: "To Be Reviewed", zh: "待审核" },
    processing: { en: "Processing", zh: "处理中" },
    failed: { en: "Failed", zh: "失败" },
    cancel: { en: "Cancelled", zh: "已撤销" },
    done: { en: "Executed", zh: "完全成交" },
    partial: { en: "Partial executed", zh: "部分成交" },
  },

  MODAL: {
    TITLE: { en: "Confirm", zh: "确认操作" },
    OK: { en: "OK", zh: "确认" },
    CANCEL: { en: "CANCEL", zh: "取消" },
  },
  HEADER: {
    FAUCET: { en: "Faucet", zh: "水龙头" },
    LAYER_1_FAUCET: { en: "LAYER 1 FAUCET", zh: "Layer1 区块水龙头" },
    LAYER_2_FAUCET: { en: "LAYER 2 FAUCET", zh: "Layer2 区块水龙头" },
    MARKETS: { en: "Markets", zh: "交易对" },
    EXCHANGE: { en: "Exchange", zh: "交易" },
    SUPPORT: { en: "Support", zh: "帮助中心" },
    GETLISTED: { en: "Get Listed", zh: "上币申请" },
    LANGUAGE: { en: "Language", zh: "语言" },
    ACTIVE_ORDERS: { en: "Open Orders", zh: "当前委托" },
    ALL_ORDERS: { en: "Order History", zh: "委托历史" },
    HISTORY: { en: "History", zh: "充提记录" },
    ACCOUNT: { en: "Account", zh: "个人中心" },
    LOGOUT: { en: "Logout", zh: "退出" },
    LOGIN: { en: "Login", zh: "登录" },
    SIGNUP: { en: "Register", zh: "注册" },
    INVITATION: { en: "Invitation", zh: "我的邀请" },
    ORDERS: { en: "Orders", zh: "订单" },
    ASSETS: { en: "Assets", zh: "资产" },
    DepositDraw: { en: "Deposit&Withdraw", zh: "充值提现" },
    DepositDrawRecord: { en: "History", zh: "财务明细" },
    EXCHANGE_ORDER: { en: "Trade", zh: "交易订单" },
    POOL: { en: "Pool", zh: "矿池" },
    INTERNAL_TRANSACTIONS: { en: "Internal Transactions", zh: "内部转账" },
    LAYER_2_EXPLORER: { en: "Explorer", zh: "Layer2 区块浏览器" },
    CONNECT_WALLET: { en: "Connect to a wallet", zh: "连接钱包" },
    PLEASE_INSTALL_METAMASK: {
      en: "Please install MetaMask before connecting",
      zh: "请先安装MetaMask",
    },
    CUR_LANGUAGE: { en: "EN", zh: "中文" },
    INVITAION: { en: "Invitation", zh: "我的邀请" },
    VOTE: { en: "Vote", zh: "投票" },
  },

  FOOTER: {
    HELP: { en: "Help", zh: "帮助" },
    TERMS: { en: "Terms", zh: "条款" },
  },

  ACCOUNT: {
    ACCOUNT_DETAILS_TITLE: { en: "Account Details", zh: "账户详情" },
    ACCOUNT_ID_LABEL: { en: "Account ID", zh: "账户ID" },
    ADDRESS_LABEL: { en: "Address", zh: "地址" },
    LAYER_2_ADDRESS_LABEL: { en: "Layer 2 Address", zh: "二层地址" },
  },

  INTERNAL_TRANSACTIONS: {
    TIME: { en: "Time", zh: "时间" },
    FROM: { en: "From", zh: "发出方" },
    TO: { en: "To", zh: "发至方" },
    ASSET: { en: "Asset", zh: "资产名称" },
    AMOUNT: { en: "Amount", zh: "数量" },
    FETCH_FAILED: { en: "Data fetching failed", zh: "获取数据出错" },
    SITE_TITLE: { en: "Internal Transactions", zh: "内部转账" },
    PAGE_HEADER: { en: "Internal transactions", zh: "内部转账" },
  },

  LAYER_2_EXPLORER: {
    BLOCK_HEIGHT: { en: "Block Height", zh: "区块高度" },
    MERKLE_ROOT: { en: "Merkle Root", zh: "默克尔树根" },
    BLOCK_TIME: { en: "Block Time", zh: "区块时间" },
    FETCH_FAILED: { en: "Data fetching failed", zh: "获取数据出错" },
    SITE_TITLE: { en: "Explorer", zh: "探索" },
    PAGE_HEADER: { en: "Explorer", zh: "探索" },
    CURRENT_BEST_BLOCK_HEIGHT: {
      en: "Current best block height:",
      zh: "当前最高区块高度：",
    },
  },

  LAYER_2_EXPLORER_DETAIL: {
    SITE_TITLE: { en: "Block Height", zh: "区块高度" },
    PAGE_HEADER: { en: "Block#", zh: "区块#" },
    BLOCK_HEIGHT: { en: "Height", zh: "高度" },
    BLOCK_TIME: { en: "Time", zh: "出块时间" },
    TX_NUMBER: { en: "TX Num", zh: "交易数" },
    BLOCK_STATUS: { en: "Block Status", zh: "区块状态" },
    L1_TX_HASH: { en: "L1 TX Hash", zh: "L1交易哈希" },
    REAL_TX_NUM: {
      en: "Real Tx Num(excluding NOP)",
      zh: "Real Tx Num(excluding NOP)",
    },

    NEW_MERKLE_ROOT: { en: "New Merkle Root", zh: "默克尔树根哈希" },
    COL_INDEX: { en: "Index", zh: "位置" },
    COL_TYPE: { en: "Type", zh: "类型" },
    COL_HASH: { en: "Hash", zh: "哈希值" },
    COL_ACTION: { en: "Action", zh: "操作" },
    DETAIL: { en: "Detail", zh: "详情" },
    TRADE: { en: "Trade", zh: "交易" },
    SENDERACCOUNT: { en: "SENDER ACCOUNT", zh: "发送方账户" },
    RECEIVER_ACCOUNT: { en: "RECEIVER_ACCOUNT", zh: "接收方账户" },
    TOKEN: { en: "Token", zh: "代币" },
    AMOUNT: { en: "Amount", zh: "数量" },
    PRICE: { en: "Price", zh: "价格" },

    UNCOMMITED: { en: "Uncommitted", zh: "未提交" },
    COMMITED: { en: "Committed", zh: "已提交" },
    VERIFIED: { en: "Verified", zh: "已验证" },

    SPOT_TRADE: { en: "Spot Trade", zh: "现货交易" },
    DEPOSIT: { en: "Deposit", zh: "充值" },
    WITHDRAW: { en: "Withdraw", zh: "提现" },
    TRANSFER: { en: "Transfer", zh: "划转" },
    NOP: { en: "Nop", zh: "空操作" },

    ACCOUNT_ID: { en: "Account ID", zh: "账户ID" },
    ORDER1_ACCOUNT_ID: { en: "Order1 Account ID", zh: "订单1账户ID" },
    ORDER2_ACCOUNT_ID: { en: "Order2 Account ID", zh: "订单2账户ID" },
    TOKEN_ID_1_TO_2: { en: "Token ID 1 To 2", zh: "代币 1 到 2" },
    TOKEN_ID_2_TO_1: { en: "Token ID 2 To 1", zh: "代币 2 到 1" },
    AMOUNT_1TO2: { en: "Amount 1 To 2", zh: "数量 1 到 2" },
    AMOUNT_2TO1: { en: "Amount 2 To 1", zh: "数量 2 到 1" },

    ACCOUNT1_TOKEN_BUY_NEW_BALANCE: {
      en: "Account1 Token Buy New Balance",
      zh: "账户1购买后代币余额（之后）",
    },
    ACCOUNT1_TOKEN_BUY_OLD_BALANCE: {
      en: "Account1 Token Buy Old Balance",
      zh: "账户1购买后代币余额（之前）",
    },
    ACCOUNT1_TOKEN_SELL_NEW_BALANCE: {
      en: "Account1 Token Sell New Balance",
      zh: "账户1出售后代币余额（之后）",
    },
    ACCOUNT1_TOKEN_SELL_OLD_BALANCE: {
      en: "Account1 Token Sell Old Balance",
      zh: "账户1出售后代币余额（之前）",
    },
    ACCOUNT2_TOKEN_BUY_NEW_BALANCE: {
      en: "Account2 Token Buy New Balance",
      zh: "账户2购买后代币余额（之后）",
    },
    ACCOUNT2_TOKEN_BUY_OLD_BALANCE: {
      en: "Account2 Token Buy Old Balance",
      zh: "账户2购买后代币余额（之前）",
    },
    ACCOUNT2_TOKEN_SELL_NEW_BALANCE: {
      en: "Account2 Token Sell New Balance",
      zh: "账户2出售后代币余额（之后）",
    },
    ACCOUNT2_TOKEN_SELL_OLD_BALANCE: {
      en: "Account2 Token Sell Old Balance",
      zh: "账户2出售后代币余额（之前）",
    },
    TOKEN_ID: { en: "Token ID", zh: "代币ID" },
    OLD_BALANCE: { en: "Old Balance", zh: "余额（之前）" },
    NEW_BALANCE: { en: "New Balance", zh: "余额（之后）" },
    FROM: { en: "From", zh: "来自" },
    TO: { en: "To", zh: "转到" },
  },

  LAYER_2_EXPLORER_TOKEN: {
    TOKEN_DETAILS_TITLE: { en: "Token Details", zh: "代币详情" },
    SYMBOL: { en: "Symbol", zh: "符号" },
    NAME: { en: "Name", zh: "名称" },
    CHAIN_ID: { en: "Chain ID", zh: "链ID" },
    TOKEN_ADDRESS: { en: "Token Address", zh: "代币地址" },
  },

  EXCHANGE: {
    SITE_TITLE: { en: "Exchange", zh: "交易" },
    MARKET_TRADES_TIT: { en: "Trade History	", zh: "最新成交" },
    ACTIVE_ORDER_TIT: { en: "Open Orders", zh: "当前委托" },
    ALL_ORDER_TIT: { en: "Order History", zh: "委托历史" },
  },

  EXCHANGE_COIN_SWITCH: {
    SEARCH_PLACEHOLDER: { en: "Search", zh: "搜索" },
    COL_PAIR: { en: "Pair", zh: "币种" },
    COL_PRICE: { en: "Price", zh: "最新价" },
    COL_CHANGE: { en: "Change", zh: "涨幅" },
  },

  EXCHANGE_ACTIVE_ORDERS: {
    BUY: { en: "BUY", zh: "买入" },
    SELL: { en: "SELL", zh: "卖出" },
    CANCEL_DONE: { en: "Cancelled", zh: "已撤销" },
    CANCEL_ALL: { en: "Cancel All", zh: "全部撤销" },
    CANCEL_CONFIRM: {
      en: "Are you sure to cancel all open orders? Confirm Cancel",
      zh: "确认全部撤销？",
    },
    CANCEL_FAILD: { en: "Failed", zh: "失败" },
    TABLE_COL_CREATED_AT: { en: "Date", zh: "时间" },
    TABLE_COL_MARKET: { en: "Pair", zh: "市场" },
    TABLE_COL_SIDE: { en: "Side", zh: "方向" },
    TABLE_COL_PRICE: { en: "Price", zh: "价格" },
    TABLE_COL_VOLUME: { en: "Amount", zh: "数量" },
    TABLE_COL_TOTAL_VOLUME: { en: "Total", zh: "委托总额" },
    TABLE_COL_EXEX_VOLUME: { en: "Executed", zh: "已成交" },
    TABLE_COL_UNEXEX_VOLUME: { en: "Unexecuted", zh: "未成交" },
    TABLE_COL_ACTION: { en: "Action", zh: "操作" },
    TABLE_COL_CANCEL: { en: "Cancel", zh: "撤销" },
    CHECK_MORE: { en: "More", zh: "查看全部" },
  },

  EXCHANGE_ALL_ORDERS: {
    BUY: { en: "BUY", zh: "买入" },
    SELL: { en: "SELL", zh: "卖出" },
    TABLE_COL_CREATED_AT: { en: "Date", zh: "时间" },
    TABLE_COL_MARKET: { en: "Pair", zh: "市场" },
    TABLE_COL_SIDE: { en: "Side", zh: "方向" },
    TABLE_COL_PRICE: { en: "Price", zh: "价格" },
    TABLE_COL_TOTAL_VOLUME: { en: "Total", zh: "委托量" },
    TABLE_COL_AVG_PRICE: { en: "Average Price", zh: "成交均价" },
    TABLE_COL_VOLUME_X: { en: "Executed", zh: "已成交" },
    TABLE_COL_STATE: { en: "Status", zh: "状态" },
    CHECK_MORE: { en: "More", zh: "查看全部" },
    LAST_7DAYS: { en: "(Last 7 days)", zh: "(最近一周)" },
  },

  EXCHANGE_MARKET_TRADE: {
    COL_TIME: { en: "Date", zh: "时间" },
    COL_PRICE: { en: "Price", zh: "价格" },
    COL_VOLUME: { en: "Amount", zh: "数量" },
  },

  EXCHANGE_TICKER: {
    LAST_PRICE: { en: "Last Price", zh: "最新价格" },
    "24H_CHANGE": { en: "Change", zh: "涨幅" },
    "24H_HEIGHT": { en: "24h High", zh: "24h 最高" },
    "24H_LOW": { en: "24h Low", zh: "24h 最低" },
    "24H_VOLUME": { en: "24h Volume", zh: "24h 成交量" },
  },

  EXCHANGE_NOTICE: {
    MORE: { en: "More", zh: "更多" },
  },

  EXCHANGE_ORDER_BOOK: {
    TIT: { en: "Order Book", zh: "买卖盘" },
    COL_PRICE: { en: "Price", zh: "价格" },
    COL_VOLUME: { en: "Amount", zh: "数量" },
    COL_TOTAL: { en: "Total", zh: "累计" },
  },

  EXCHANGE_TRADEBOX: {
    BUY_BTN: { en: "BUY ", zh: "买入" },
    SELL_BTN: { en: "SELL ", zh: "卖出" },
    TAB_LIMIT: { en: "Limit", zh: "限价交易" },
    TAB_MARKET: { en: "Market", zh: "市价交易" },
    CREATE_SIGNATURE_FAILED: {
      en: "Failed to create signature. Please try again",
      zh: "创建签名失败，请重试",
    },
    CREATE_SUCCESS: { en: "Created", zh: "已创建" },
    CREATE_FAILD: { en: "Failed", zh: "创建失败" },
  },

  EXCHANGE_TRADEBOX_FORM: {
    BUY_BTN: { en: "BUY ", zh: "买入" },
    SELL_BTN: { en: "SELL ", zh: "卖出" },
    BUY_PRICE: { en: "Price", zh: "买入价" },
    SELL_PRICE: { en: "Price", zh: "卖出价" },
    BUY_AT_BEST_PRICE: { en: "The best price", zh: "以市场最优价格买入" },
    SELL_AT_BEST_PRICE: { en: "The best price", zh: "以市场最优价格卖出" },
    MISSING_PRICE: { en: "Please enter price", zh: "请输入价格" },
    MISSING_AMOUNT: { en: "Please enter Amount", zh: "请输入数量" },
    BUY_VOLUME: { en: "Amount", zh: "买入量" },
    TRANS_AMOUNT: { en: "Total", zh: "交易额" },
    SELL_AMOUNT: { en: "Amount", zh: "卖出量" },
    TOTAL: { en: "Total", zh: "总计" },
    AVAILABLE: { en: "Available", zh: "可用" },
    LOGIN: { en: "Login", zh: "登录" },
    OR: { en: "or", zh: "或" },
    SIGNUP: { en: "Register", zh: "注册" },
    MAX_BUY_PRICE: {
      en: "Buy price cannot be more than 110% of current price",
      zh: "买入价格不能超过现价的110%",
    },
    MAX_SELL_PRICE: {
      en: "Sell price cannot be less than 90% of current price",
      zh: "卖出价格不能低于现价的90%",
    },
    MAX_BUY_VOLUME: {
      en: "Buy volume cannot be more than ${X}",
      zh: "买入数量不能高于${X}",
    },
    INVALID_PRICE: {
      en: "Please enter the correct price",
      zh: "请输入正确的价格",
    },
    INVALID_AMOUNT: {
      en: "Please enter the correct amount",
      zh: "请输入正确的数量",
    },
    BALANCE_NOT_ENOUGH: { en: "Balance not enough", zh: "余额不足" },
  },

  EXCHANGE_TRADEBOX_ASSETS_BOX: {
    TITLE: { en: "Assets", zh: "资产" },
    DEPOSIT: { en: "Deposit", zh: "充值" },
    WITHDRAW: { en: "Withdraw", zh: "提现" },
    MISSING_CURRENCY: { en: "Currency missing", zh: "请选择货币" },
    INVALID_AMOUNT: {
      en: "Please enter the correct amount",
      zh: "请输入正确的数量",
    },
    MISSING_AMOUNT: { en: "Amount missing", zh: "缺少数量" },
    CURRENCY_TITLE: { en: "Currency", zh: "货币" },
    AMOUNT_TITLE: { en: "Amount", zh: "数量" },
  },

  EXCHANGE_TRADEBOX_TOKEN_SELECT: {
    MODAL_TITLE: { en: "Select a token", zh: "选择币种" },
    SEARCH_BOX_PLACEHOLDER: {
      en: "Search name or paste address",
      zh: "搜索币名或地址",
    },
    SEARCH_RESULTS_FROM_TOKEN_LISTS: {
      en: "Search results from Token Lists",
      zh: "币种搜索结果",
    },
    RESULTS_FROM_SEARCH_REACHED_LIMIT: {
      en: "(More tokens are available, please refine your keyword...)",
      zh: "（符合搜索条件的币种太多，请添加关键词...）",
    },
    ADD_TOKEN_BY_ADDRESS_PLACEHOLDER: {
      en: "Provide the token's address...",
      zh: "请输入货币的地址...",
    },
    TOKEN_NOT_FOUND_PROMPT: {
      en: "No tokens found. Import by providing the token's address below:",
      zh: "找不到货币。请输入货币的地址添加",
    },
  },

  ASSETS: {
    HISTORY: { en: "History", zh: "财务记录" },
    SITE_TITLE: { en: "Assets", zh: "资产" },
    TIT: { en: "Assets", zh: "资产" },
    COIN: { en: "Coin", zh: "币种" },
    AVAILABLE: { en: "Available", zh: "可用" },
    ON_ORDERS: { en: "On Orders", zh: "锁定" },
    BTC_VALUATION: { en: "BTC Valuation", zh: "BTC 折算" },
    ACTION: { en: "Action", zh: "操作" },
    EXCHANGE_ASSETS: { en: "Exchange Assets", zh: "交易资产" },
    ESTIMATED_VALUE: { en: "Estimated Value", zh: "估值" },
    ASSETS_HIDDEN: { en: "Hide small  balances", zh: "隐藏小额币种" },
    ASSETS_HIDDEN_TIP: {
      en: "Coins less than 0.001 BTC",
      zh: "小于 0.001 BTC",
    },
    DEPOSIT: { en: "Deposit", zh: "充值" },
    WITHDRAW: { en: "Withdraw", zh: "提现" },
    TRANSFER: { en: "Transfer", zh: "划转" },
    TRADE: { en: "Trade", zh: "交易" },
    TRANSDER_SUCCESS: { en: "Success", zh: "成功" },
    TRANSDER_FAILD: { en: "Failed", zh: "失败" },
    EXCHANGE: { en: "Convert", zh: "兑换" },
    TRANSFET_TYPE: { en: "${a} to ${b}", zh: "${a}至${b}" },
    EXCHANGE_BOX: { en: "Convert ${a} to ${b}", zh: "${a}兑换${b}" },
    EXCHANGE_BTN: { en: "Confirm", zh: "确定" },
    WITHDRAW_PRE_TIP: {
      en: "You need to complete a transaction over 30 USDT before you can withdraw.",
      zh: "您需要完成一笔交易且交易额折合大于 30 USDT，才可以提现。",
    },
    WITHDRAW_PRE_CANCEL: {
      en: "Cancel",
      zh: "取消",
    },
    WITHDRAW_PRE_TRADE: {
      en: "Go to trade",
      zh: "去交易",
    },
  },

  USER_ASSET_PAGE: {
    ASSET_COIN: { en: "Coin", zh: "币种" },
    ASSET_AMOUNT: { en: "Amount", zh: "数量" },
    ASSET_TOTAL_VALUE: { en: "Total", zh: "总价值" },
    ASSET_TOTAL: { en: "Total", zh: "总价值" },
    EXCHANGE_ASSETS: { en: "Exchange Assets", zh: "交易资产" },
  },

  WITHDRAW_BOX: {
    MISSING_ADDRESS: { en: "Address Missing", zh: "缺少地址" },
    MISSING_AMOUNT: { en: "Amount Missing", zh: "缺少数量" },
    WITHDRAW_ADDRESS: { en: "Address", zh: "地址" },
    WITHDRAW_MEMO: { en: "Memo", zh: "Memo" },
    WITHDRAW_NOMEMO: { en: "No Memo", zh: "无 Memo" },
    MEMOERROR: {
      en: "Please fill in Memo, or check no Memo",
      zh: "请填写Memo，或勾选无 Memo",
    },
    WITHDRAW_AMOUNT: { en: "Amount", zh: "数量" },
    SUBMIT_BTN: { en: "Submit", zh: "提交" },
    AVAILABLE: { en: "Available", zh: "可用" },
    ADDRESSERROR: {
      en: "The account does not exist, please re-enter",
      zh: "账户名不存在，请重新输入",
    },
    ADDRESS_TIPS: {
      en: "(*Please double-check the address. The transfer cannot be reversed.)",
      zh: "（*请再次确认地址正确，转账结果不可逆。）",
    },
    TRANSCATION_FEE: { en: "Transaction Fee", zh: "手续费" },
    YOU_WILL_GET: { en: "You will receive", zh: "到账" },
    VOLUME_ERROR1: {
      en: "Minimum withdrawal amount: {num} {symbol}",
      zh: "提现金额必须大于{num} {symbol}",
    },
    VOLUME_ERROR2: {
      en: "exceed maximum withdrawal amount, please retry",
      zh: "超出最大可提现金额，请重新填写",
    },
  },

  WITHDRAW_POP: {
    TITLE: { en: "Withdraw your balance", zh: "提现余额" },
    ENSURESAFETY: {
      en: "* To ensure safety, we will send a confirmation code to your registered number: ",
      zh: "* 为保证您的资金安全，我们会发送一组验证码到您的注册手机上：",
    },
    GOOGLEAUTH: { en: "Google Verification Code", zh: "谷歌验证码" },
    CAPTCHACODE: { en: "CAPTCHA", zh: "请填写右侧验证码" },
    VERFIYCODE: { en: "Verification Code", zh: "手机验证码" },
    AFTERSEC: { en: "After {num}s", zh: "{num}s 后" },
    GETCODEBUTTON: { en: "Get Code", zh: "获取验证码" },
    SUBMIT_BTN: { en: "Submit", zh: "提交" },
    CAPTCHAEMPTY: { en: "Captcha cannot be empty", zh: "请填写安全验证码" },
    NEETCAPTCHA: { en: "Captcha cannot be empty", zh: "请进行人机验证" },
  },

  DEPOSIT_BOX: {
    COPIED: { en: "Successed", zh: "复制成功" },
    UN_AVAILABLE: {
      en: "Current currency deposit channel closed",
      zh: "当前币种充值通道已关闭",
    },
    DEPOSIT_ADDRESS: { en: "Deposit Address", zh: "充币地址" },
    COPY: { en: "Copy", zh: "复制" },
    DEPOSIT_MEMO: { en: "Deposit Memo", zh: "Memo" },
    DEPOSIT_ADDR_QR: { en: "QR Code", zh: "充币地址二维码" },
    MEMO_CONFIRM_TIT: { en: "Attention", zh: "注意" },
    MEMO_CONFIRM_TIPS: {
      en: "* When you deposit currency, you must fill in the Memo label in digits provided by us. Illegal Memo deposits will lead to transaction failure.",
      zh: "Memo和地址同时填写才能充值成功，否则充值资金将无法到账",
    },
    MEMO_CONFIRM_BUTTON: { en: "Deposit", zh: "继续充值" },
  },

  HISTORY: {
    TIT: { en: "History", zh: "财务记录" },
    DEPOSIT_HISTORY: { en: "Deposit History", zh: "充值记录" },
    WITHDRAW_HISTORY: { en: "Withdraw History", zh: "提现记录" },
    TRANSFER_HISTORY: { en: "Transfer History", zh: "划转记录" },
    OTHERS_HISTORY: { en: "Other History", zh: "其他记录" },
    COL_COMPLETED: { en: "Processing Time", zh: "完成时间" },
    COL_CREATED_AT: { en: "Date", zh: "时间" },
    COL_TRANSFET_TYPE: { en: "Type", zh: "类型" },
    COL_TO: { en: "To", zh: "收款方" },
    COL_COIN: { en: "Coin", zh: "币种" },
    COL_AMOUNT: { en: "Amount", zh: "数量" },
    COL_TXID: { en: "TxID", zh: "TxID" },
    COL_STATUS: { en: "Status", zh: "状态" },
    TRANSFET_TYPE: { en: "${a} to ${b}", zh: "${a}至${b}" },

    TRANSFET_TYPE_null: { en: "Exchange Account", zh: "交易账户" },
  },

  ORDERS: {
    TIT: { en: "Status", zh: "状态" },
    ACTIVE_ORDER: { en: "Open Orders", zh: "当前委托" },
    ALL_ORDER: { en: "Order History", zh: "委托历史" },
  },

  ACTIVE_ORDER: {
    BUY: { en: "BUY", zh: "买入" },
    SELL: { en: "SELL", zh: "卖出" },
    COL_CREATED_AT: { en: "Date", zh: "时间" },
    COL_MARKET: { en: "Pair", zh: "市场" },
    COL_SIDE: { en: "Side", zh: "方向" },
    COL_PRICE: { en: "Price", zh: "价格" },
    COL_VOLUME: { en: "Amount", zh: "数量" },
    COL_TOTAL: { en: "Total", zh: "委托总额" },
    COL_EXEC_VOL: { en: "Executed", zh: "已成交" },
    COL_UNEXEC_VOL: { en: "Unexecuted", zh: "未成交" },
    COL_ACTION: { en: "Action", zh: "操作" },
    CANCEL: { en: "Cancel", zh: "撤销" },
    FILTER_SELECT: { en: "Select", zh: "选择" },
    FILTER_MARKET: { en: "Pair", zh: "市场" },
    FILTER_SIDE: { en: "Side", zh: "方向" },
    FILTER_SIDE_SELL: { en: "Sell", zh: "出售" },
    FILTER_SIDE_BUY: { en: "Buy", zh: "购买" },
    FILTER_SUBMIT: { en: "Search", zh: "搜索" },
    FILTER_RESET: { en: "Reset", zh: "重置" },
    FILTER_ORDER_TYPE: { en: "Type", zh: "类型" },
    CANCEL_ALL: { en: "Cancel All", zh: "全部撤销" },
    MARKET_ORDER_PRICE: { en: "Market", zh: "市价" },
    CANCEL_CONFIRM: {
      en: "Are you sure to cancel all open orders? Confirm Cancel",
      zh: "确认全部撤销？",
    },
  },

  ALL_ORDER: {
    BUY: { en: "BUY", zh: "买入" },
    SELL: { en: "SELL", zh: "卖出" },
    COL_CREATED_AT: { en: "Date", zh: "时间" },
    COL_MARKET: { en: "Pair", zh: "市场" },
    COL_MARKET_PRICE: { en: "Market", zh: "市价" },
    COL_SIDE: { en: "Side", zh: "方向" },
    COL_PRICE: { en: "Price", zh: "价格" },
    COL_EXEC_VOLUME: { en: "Amount", zh: "数量" },
    COL_AVG_PRICE: { en: "Average Price", zh: "成交均价" },
    COL_EXEC_AMOUNT: { en: "Total", zh: "成交额" },
    COL_STATUS: { en: "Status", zh: "状态" },
    COL_ACTION: { en: "Action", zh: "操作" },
    COL_FEE: { en: "Fee", zh: "手续费" },
    FILTER_SELECT: { en: "Select", zh: "选择" },
    FILTER_TIME: { en: "Time", zh: "时间" },
    FILTER_TIME_START: { en: "Start Time", zh: "开始时间" },
    FILTER_TIME_END: { en: "End Time", zh: "结束时间" },
    FILTER_MARKET: { en: "Pair", zh: "市场" },
    FILTER_SIDE: { en: "Side", zh: "方向" },
    FILTER_SIDE_SELL: { en: "Sell", zh: "出售" },
    FILTER_SIDE_BUY: { en: "Buy", zh: "购买" },
    FILTER_SUBMIT: { en: "Search", zh: "搜索" },
    FILTER_RESET: { en: "Reset", zh: "重置" },
    FILTER_ORDER_TYPE: { en: "Type", zh: "类型" },
    DETAIL: { en: "Detail", zh: "详情" },
  },

  LOWSATE_BOX: {
    TITLE: { en: "Please upgrade security level", zh: "温馨提示" },
    CONTENT: {
      en: "Low account security level, two-factor authentication is recommended",
      zh: "您账户的安全等级较低，建议您开启二次验证",
    },
    GOOGLEAUTH: { en: "Google Authenticator", zh: "谷歌验证" },
    PHONE: { en: "SMS Authenticator", zh: "手机验证" },
  },

  MODEL_ETHEREUM: {
    PLEASE_INSTALL_METAMASK: {
      en: "Please install MetaMask before using Fluidex",
      zh: "请先安装MetaMask",
    },
    PLEASE_RECONNECT: {
      en: "Please reconnect your wallet on MetaMask",
      zh: "请重新在MetaMask连接钱包",
    },
    PLEASE_SIGN_LAYER2_ADDRESS: {
      en: "Please sign your layer 2 address on MetaMask",
      zh: "请在MetaMask签署第二层地址",
    },
  },
  MARKETS: {
    TIT: { en: "Markets", zh: "交易对" },
    TABLE_COL_NAME: { en: "Pair", zh: "交易对" },
    TABLE_COL_PRICE: { en: "Last Price", zh: "最新价" },
    TABLE_COL_24H_CHANGE: { en: "24h Change", zh: "24h 涨幅" },
    TABLE_COL_24H_HIGH_LOW: {
      en: "24h High / 24h Low",
      zh: "24h 最高价 / 24h 最低价",
    },
    TABLE_COL_24H_VOLUME: { en: "24h Volume", zh: "24h 量" },
    TABLE_COL_MARKET_CAP: { en: "Market Cap", zh: "Market Cap" },
    TABLE_COL_ACTION: { en: "Action", zh: "操作" },
    TABLE_TRADE: { en: "Trade", zh: "去交易" },
  },
};

export const trans = (prefix = "", lan, name, ...args) => {
  let result;
  try {
    const source = prefix ? i18n[prefix][name] : i18n[name];
    result = source[lan] || source.en || source.zh;
  } catch (error) {
    result = name.split("_").slice(1).join(" ") || name;
  }

  if (result && args.length) {
    result = result.replace(/\$\{.\}/g, [].shift.bind(args));
  }

  return result;
};

const checkLan = (str) => (["en", "zh", "ko"].indexOf(str) > -1 ? str : null);

export const defaultLan = () => {
  let lang = navigator.language || navigator.userLanguage;
  lang = lang.substr(0, 2);
  return checkLan(lang) || "en";
};

export default i18n;
