import api from "./api.js";

// params can include: stage, priority, search, page, limit, sortBy, order
export const fetchOpportunities = async (params = {}) => {
  const { data } = await api.get("/opportunities", { params });
  return data;
};

export const fetchOpportunitySummary = async () => {
  const { data } = await api.get("/opportunities/summary");
  return data;
};

export const fetchOpportunityById = async (id) => {
  const { data } = await api.get(`/opportunities/${id}`);
  return data;
};

export const createOpportunity = async (payload) => {
  const { data } = await api.post("/opportunities", payload);
  return data;
};

export const updateOpportunity = async (id, payload) => {
  const { data } = await api.put(`/opportunities/${id}`, payload);
  return data;
};

export const deleteOpportunity = async (id) => {
  const { data } = await api.delete(`/opportunities/${id}`);
  return data;
};
