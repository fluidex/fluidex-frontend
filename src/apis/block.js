import api from "./index";

export const getBlockDetail = ({ blockId }) =>
  api.get(`/api/explorer/l2_block/${blockId}`);
