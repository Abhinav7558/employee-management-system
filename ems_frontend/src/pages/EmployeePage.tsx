import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  deleteEmployee,
} from "../services/employeeservice";
import { getFormTemplates } from "../services/formService";
import type { Employee, EmployeeFormData } from "../types/employee";
import type { FormTemplate } from "../types/form";
import Modal from "../components/shared/Modal";
import { Plus } from "lucide-react";
import EmployeeForm from "../components/forms/EmployeeForm";
import axios from "axios";

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmployees();
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setEmployees(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to load employees");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await getFormTemplates();
      const templates = Array.isArray(res.data)
        ? res.data
        : res.data.results || [];
      setFormTemplates(templates);
    } catch {
      setError("Failed to load form templates");
    }
  };

  const handleCreate = async (data: EmployeeFormData) => {
    try {
      await createEmployee(data);
      await fetchEmployees();
      setIsModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to create employee");
      } else {
        setError("Unexpected error");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      await fetchEmployees();
    } catch {
      setError("Failed to delete employee");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTemplates();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> New Employee
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white shadow p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">
                Employee ID: {emp.id}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {emp.fieldValues?.map((fv) => (
                  <li key={fv.id}>
                    <strong>{fv.formField?.fieldLabel || "Unnamed"}:</strong>{" "}
                    {fv.fieldValue}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Employee Form"
      >
        <EmployeeForm formTemplates={formTemplates} onSubmit={handleCreate} />
      </Modal>
    </div>
  );
}
