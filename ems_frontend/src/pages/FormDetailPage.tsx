import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormTemplate } from "../services/formService";
import type { FormTemplate, FormField } from "../types/form";

export default function FormDetailPage() {
  const { id } = useParams();
  const [form, setForm] = useState<FormTemplate | null>(null);

  useEffect(() => {
    if (id) {
      getFormTemplate(Number(id))
        .then((res) => {
          const data = res.data;

          const sanitizedFields: FormField[] = data.fields.map(
            (field: FormField, index: number) => ({
              id: field.id ?? `field-${index}`,
              fieldLabel: field.fieldLabel ?? `Field ${index + 1}`,
              fieldType: field.fieldType ?? "TEXT",
              fieldName: field.fieldName ?? `field_${index + 1}`,
              isRequired: field.isRequired ?? false,
              fieldOrder: field.fieldOrder ?? index,
              fieldOptions: field.fieldOptions ?? null,
              validationRules: field.validationRules ?? null,
            })
          );

          setForm({ ...data, fields: sanitizedFields });
        })
        .catch(console.error);
    }
  }, [id]);

  if (!form) return <div className="p-4">Loading form...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-2">
        {form.name || "Untitled Form"}
      </h1>
      <p className="text-gray-600 mb-6">
        {form.description || "No description"}
      </p>

      <div className="space-y-4">
        {form.fields.map((field, index) => (
          <div
            key={field.id ?? index}
            className="border p-4 rounded bg-gray-50"
          >
            <div className="mb-2">
              <span className="font-semibold">Label:</span>{" "}
              {field.fieldLabel || `Field ${index + 1}`}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Type:</span>{" "}
              {field.fieldType || "TEXT"}
            </div>
            <div>
              <span className="font-semibold">Required:</span>{" "}
              {field.isRequired ? "Yes" : "No"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
