import api from "@/utils/request";

export const getBlockDetail = ({ blockId }) =>
  api.get(`/api/explorer/l2_block/${blockId}`);
