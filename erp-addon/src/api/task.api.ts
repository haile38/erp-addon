/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, ticket } from "./axios";

export async function getListMerchant(params: unknown) {
  const response = await api.post("/Customer/ListMerchants", params);
  return response.data;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export async function getListTeamMember(params: {}){
  const response = await ticket.post("/api/TeamMembers/ListTeamMembers", params);
  return response.data;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export async function CreateOrUpdate(params: {}){
  const response = await ticket.post("/api/Ticket/CreateOrUpdate", params);
  return response.data;
}
export async function updateTicketState(params: any){
    const response = await ticket.post("/api/Ticket/UpdateTicketStage", params)
    return response.data;
}