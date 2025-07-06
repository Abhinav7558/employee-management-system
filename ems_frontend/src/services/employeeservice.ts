import axios from "axios";
import type { EmployeeFormData } from "../types/employee";

const API_URL = "/api/employees/";

export const getEmployees = () => {
  return axios.get(API_URL);
};

export const getEmployee = (id: number) => {
  return axios.get(`${API_URL}${id}/`);
};

export const createEmployee = (data: EmployeeFormData) => {
  return axios.post(API_URL, data);
};

export const updateEmployee = (id: number, data: EmployeeFormData) => {
  return axios.put(`${API_URL}${id}/`, data);
};

export const deleteEmployee = (id: number) => {
  return axios.delete(`${API_URL}${id}/`);
};
