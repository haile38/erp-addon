import { api, ticket } from "./axios";

export async function getListMerchant(params: unknown) {
  const response = await api.post("/Customer/ListMerchants", params);
  return response.data;
}
export async function getListTeamMember(params: {}){
  const response = await ticket.post("/api/TeamMembers/ListTeamMembers", params);
  return response.data;
}