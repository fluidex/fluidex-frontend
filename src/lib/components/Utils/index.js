import * as exchange from "./exchange";
import Message from "./message";

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formData(data) {
  return Object.keys(data).reduce(
    (prev, next) => (prev.append(next, data[next]), prev),
    new FormData()
  );
}

export { exchange, Message };

const Utils = {
  exchange,
  Message,
  delay,
  formData,
};
export default Utils;
