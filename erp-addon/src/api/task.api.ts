import { api } from "./axios";

export async function getListMerchant(params: unknown) {
  const response = await api.post("/Customer/ListMerchants", params);
  return response.data;
}