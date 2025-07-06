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

export default function FormBuilderPage() {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchForms = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getFormTemplates();
      setFormTemplates(res.data.results);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail || err.message || "Something went wrong";
        setError(message);
      } else {
        setError("Unexpected error");
      }
    }
  };

  const handleCreate = async (form: FormTemplate) => {
    try {
      await createFormTemplate(form);
      fetchForms();
      setIsModalOpen(false);
    } catch {
      setError("Failed to create form template");
    }
  };

  const handleUpdate = async (form: FormTemplate) => {
    if (form.id) {
      try {
        await updateFormTemplate(form.id, form);
        fetchForms();
        setSelectedForm(null);
      } catch {
        setError("Failed to update form template");
      }
    }
  };

  const handleDelete = async (id: number) => {
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
