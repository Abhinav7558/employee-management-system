import API from "./axios";
import type { EmployeeFormData } from "../types/employee";

const API_URL = "/employees/";

export const getEmployees = () => {
  return API.get(API_URL);
};

export const getEmployee = (id: number) => {
  return API.get(`${API_URL}${id}/`);
};

export const createEmployee = (data: EmployeeFormData) => {
  return API.post(API_URL, data);
};

export const updateEmployee = (id: number, data: EmployeeFormData) => {
  return API.put(`${API_URL}${id}/`, data);
};

export const deleteEmployee = (id: number) => {
  return API.delete(`${API_URL}${id}/`);
};
