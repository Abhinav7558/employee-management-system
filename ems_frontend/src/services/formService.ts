import axios from "axios";
import type { FormTemplate } from "../types/form";
import type { FormTemplateQueryParams } from "../types/api";

export const getFormTemplates = (params?: FormTemplateQueryParams) =>
  axios.get("/forms/", { params });

export const getFormTemplate = (id: number) => axios.get(`/forms/${id}/`);

export const createFormTemplate = (data: FormTemplate) =>
  axios.post("/forms/", data);

export const updateFormTemplate = (id: number, data: FormTemplate) =>
  axios.put(`/forms/${id}/`, data);

export const deleteFormTemplate = (id: number) => axios.delete(`/forms/${id}/`);

export const duplicateFormTemplate = (id: number) =>
  axios.post(`/forms/${id}/duplicate/`);
