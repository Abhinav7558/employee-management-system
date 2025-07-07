import API from "./axios";
import type { FormTemplatePayload } from "../types/form";
import type { FormTemplateQueryParams } from "../types/api";

export const getFormTemplates = (params?: FormTemplateQueryParams) =>
  API.get("/forms/", { params });

export const getFormTemplate = (id: number) => API.get(`/forms/${id}/`);

export const createFormTemplate = (data: FormTemplatePayload) =>
  API.post("/forms/", data);

export const updateFormTemplate = (id: number, data: FormTemplatePayload) =>
  API.put(`/forms/${id}/`, data);

export const deleteFormTemplate = (id: number) => API.delete(`/forms/${id}/`);

export const duplicateFormTemplate = (id: number) =>
  API.post(`/forms/${id}/duplicate/`);
