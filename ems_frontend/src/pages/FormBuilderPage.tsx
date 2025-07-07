import { useEffect, useState } from "react";
import {
  getFormTemplates,
  createFormTemplate,
  updateFormTemplate,
  deleteFormTemplate,
  duplicateFormTemplate,
} from "../services/formService";
import type { FormTemplate } from "../types/form";
import FormDesigner from "../components/forms/FormDesigner";
import Modal from "../components/shared/Modal";
import { Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FormBuilderPage() {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchForms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getFormTemplates();
      setFormTemplates(
        Array.isArray(res.data) ? res.data : res.data.results || []
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail || err.message || "Something went wrong";
        setError(message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const transformFieldsToSnakeCase = (form: FormTemplate) =>
    form.fields.map((f, index) => ({
      field_name: f.fieldLabel.toLowerCase().replace(/\s+/g, "_"),
      field_label: f.fieldLabel,
      field_type: f.fieldType,
      is_required: f.isRequired ?? false,
      field_order: index,
      field_options: f.fieldOptions ?? null,
      validation_rules: f.validationRules ?? null,
    }));

  const handleCreate = async (form: FormTemplate) => {
    try {
      const transformedForm = {
        name: form.name,
        description: form.description,
        fields: transformFieldsToSnakeCase(form),
      };
      await createFormTemplate(transformedForm);
      fetchForms();
      setIsModalOpen(false);
    } catch {
      setError("Failed to create form template");
    }
  };

  const handleUpdate = async (form: FormTemplate) => {
    if (form.id) {
      try {
        const transformedForm = {
          name: form.name,
          description: form.description,
          fields: transformFieldsToSnakeCase(form),
        };
        await updateFormTemplate(form.id, transformedForm);
        fetchForms();
        setSelectedForm(null);
      } catch {
        setError("Failed to update form template");
      }
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this form?"
    );
    if (!confirmed) return;

    try {
      await deleteFormTemplate(id);
      fetchForms();
    } catch {
      setError("Failed to delete form template");
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateFormTemplate(id);
      fetchForms();
    } catch {
      setError("Failed to duplicate form template");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Form Templates</h2>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" /> New Form
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : formTemplates.length === 0 ? (
        <p className="text-gray-500">No forms created yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {formTemplates.map((form) => (
            <div key={form.id} className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold mb-1">{form.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{form.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedForm(form)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/forms/${form.id}`)}
                  className="text-green-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleDuplicate(form.id!)}
                  className="text-yellow-600 hover:underline"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => handleDelete(form.id!)}
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
        isOpen={isModalOpen || selectedForm !== null}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedForm(null);
        }}
        title="Form Designer"
      >
        <FormDesigner
          initialData={selectedForm}
          onSubmit={selectedForm ? handleUpdate : handleCreate}
        />
      </Modal>
    </div>
  );
}
