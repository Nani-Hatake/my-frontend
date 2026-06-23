import api from "./api.js";

// params can include: stage, priority, search, page, limit, sortBy, order
export const fetchOpportunities = async (params = {}) => {
  const { data } = await api.get("/api/opportunities", { params });
  return data;
};

export const fetchOpportunitySummary = async () => {
  const { data } = await api.get("/api/opportunities/summary");
  return data;
};

export const fetchOpportunityById = async (id) => {
  const { data } = await api.get(`/api/opportunities/${id}`);
  return data;
};

export const createOpportunity = async (payload) => {
  const { data } = await api.post("/api/opportunities", payload);
  return data;
};

export const updateOpportunity = async (id, payload) => {
  const { data } = await api.put(`/api/opportunities/${id}`, payload);
  return data;
};

export const deleteOpportunity = async (id) => {
  const { data } = await api.delete(`/api/opportunities/${id}`);
  return data;
};
