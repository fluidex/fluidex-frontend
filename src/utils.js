import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isString from "lodash/isString";

dayjs.extend(utc);

// With the current implementation of normalizePairSymbol,
// The coin with the lowest index is the base of a pair.
// Note that coins not in this array have index -1 (they are always the base).
const MAIN_COINS = ["ETH", "BTC", "USDT"];

// trading pair price decimal point; USD/CNY price decimal point; amount decimal point
const precision = {
  BTC_USDT: [2, 2, 4],
  ETH_USDT: [2, 2, 4],
  UNI_USDT: [2, 2, 4],
  LINK_USDT: [3, 2, 3],
  MATIC_USDT: [5, 2, 4],
  ETH_BTC: [6, 2, 4],
};
// String polyfill
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function padEnd(targetLength, padString) {
    targetLength = targetLength >> 0; //floor if number or convert non-number to 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (this.length > targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return String(this) + padString.slice(0, targetLength);
    }
  };
}
// String polyfill end
export function subStringNum(num, len = 8) {
  const str = String(num);
  if (str.indexOf("-") >= 0) {
    num = "0" + String(Number(str) + 1).substr(1);
  }
  const numArr = num.toString().split(".");
  let result;
  if (numArr.length > 1) {
    result = numArr[0] + "." + numArr[1].substr(0, len);
  } else {
    result = num;
  }
  const resArr = result.toString().split(".");
  resArr[1] = resArr[1] || "";
  resArr[1] = resArr[1].padEnd(len, "0");
  return resArr.join(".");
}

export function getPrecision(market) {
  return precision[market] || [0, 0, 0];
}

export function normalizeSymbol(symbol) {
  if (Array.isArray(symbol)) {
    return String.prototype.toUpperCase.apply(symbol).split(",");
  }
  return symbol.toUpperCase();
}

export function normalizePairSymbol() {
  const coins = normalizeSymbol([].slice.call(arguments));
  return coins.sort((a, b) => MAIN_COINS.indexOf(a) - MAIN_COINS.indexOf(b));
}

export function getPair(coin1, coin2) {
  const symbolArr = normalizePairSymbol(coin1, coin2);
  const result = {
    id: symbolArr.map((d) => d.toUpperCase()).join("_"),
    arr: symbolArr,
    symbol: symbolArr.join("/"),
    baseCoin: symbolArr[0],
    quoteCoin: symbolArr[1],
  };
  return result;
}

export function multiply() {
  const args = [].slice.call(arguments, 0);
  const val = args.reduce((sum, num) =>
    BigNumber(sum).multipliedBy(BigNumber(num))
  );

  return val.toFixed();
}
export function div(a, b) {
  return BigNumber(a).dividedBy(BigNumber(b)).toFixed();
}

export function sum() {
  const args = [].slice.call(arguments, 0).map((val) => BigNumber(val));
  const val = BigNumber.sum.apply(null, args);

  return val.toFixed();
}

export function pow(base, power) {
  return BigNumber(base).pow(power).toFixed();
}

export function toNonEXP(num) {
  return BigNumber(num).toFixed();
}

export function normalizeNumByMarket(num, market, idx, pairs) {
  // console.log('normalizeNumByMarket', {num, market, idx});
  if (!num) {
    num = 0;
  }
  //market = market.toLowerCase().replace(/\//, '')
  if (typeof num === "string") {
    num = +num;
  }

  if (Number.isNaN(num)) {
    num = 0;
  }
  // If there is trade_pair data, set the amount
  if (pairs && pairs.length && idx === 2) {
    let currentMarket = pairs.find((item) => item.name === market);
    if (currentMarket) {
      return num.toFixed(currentMarket.amount_precision);
    }
  }

  if (typeof market === "string" && typeof idx === "number") {
    return num.toFixed(getPrecision(market)[idx]);
  }

  return num;
}

export const dayjsLocal = (time) => dayjs.utc(+time).local();

// We mainly use this for HEX addresses.
export const getLengthLimitedString = (
  string,
  numFirstCharsShown = 12,
  maxLength = 17
) => {
  if (!isString(string)) {
    return string;
  }

  if (numFirstCharsShown >= maxLength) {
    return string.length > numFirstCharsShown
      ? `${string.slice(0, numFirstCharsShown)}...`
      : string;
  }

  return string.length > maxLength
    ? `${string.slice(0, numFirstCharsShown)}...${string.slice(
        numFirstCharsShown - maxLength
      )}`
    : string;
};
