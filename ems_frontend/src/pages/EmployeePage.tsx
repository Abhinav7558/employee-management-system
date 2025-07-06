import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmployees();
      setEmployees(res.data.results);
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
      setFormTemplates(res.data.results);
    } catch {
      setError("Failed to load form templates");
    }
  };

  const handleCreate = async (data: {
    formTemplateId: number;
    fieldValues: Record<string, string>;
  }) => {
    const payload: EmployeeFormData = {
      form_template_id: data.formTemplateId,
      field_values: Object.entries(data.fieldValues).map(
        ([form_field, field_value]) => ({
          form_field: parseInt(form_field),
          field_value,
        })
      ),
    };
    await createEmployee(payload);
    fetchEmployees();
    setIsModalOpen(false);
  };

  const handleUpdate = async (data: {
    formTemplateId: number;
    fieldValues: Record<string, string>;
  }) => {
    if (!selectedEmployee) return;
    const payload: EmployeeFormData = {
      form_template_id: data.formTemplateId,
      field_values: Object.entries(data.fieldValues).map(
        ([form_field, field_value]) => ({
          form_field: parseInt(form_field),
          field_value,
        })
      ),
    };
    await updateEmployee(selectedEmployee.id, payload);
    fetchEmployees();
    setSelectedEmployee(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      fetchEmployees();
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
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white shadow p-4 rounded">
              <h3 className="text-lg font-semibold mb-2">
                Template: {emp.formTemplate.name}
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {emp.fieldValues.map((fv) => (
                  <li key={fv.id}>
                    <strong>{fv.formField.label}:</strong> {fv.fieldValue}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setSelectedEmployee(emp)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
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
        isOpen={isModalOpen || selectedEmployee !== null}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        title="Employee Form"
      >
        <EmployeeForm
          initialData={selectedEmployee}
          formTemplates={formTemplates}
          onSubmit={selectedEmployee ? handleUpdate : handleCreate}
        />
      </Modal>
    </div>
  );
}
