import { useForm } from "react-hook-form";
import type { Employee } from "../../types/employee";
import type { FormTemplate, FormField } from "../../types/form";
import { useEffect } from "react";

interface EmployeeFormData {
  formTemplateId: number;
  fieldValues: Record<string, string>;
}

interface Props {
  initialData: Employee | null;
  formTemplates: FormTemplate[];
  onSubmit: (data: EmployeeFormData) => void;
}

export default function EmployeeForm({
  initialData,
  formTemplates,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    defaultValues: {
      formTemplateId: initialData?.formTemplate.id ?? undefined,
      fieldValues: initialData
        ? Object.fromEntries(
            initialData.fieldValues.map((fv) => [
              fv.formField.id,
              fv.fieldValue,
            ])
          )
        : {},
    },
  });

  const selectedTemplateId = watch("formTemplateId");
  const selectedTemplate = formTemplates.find(
    (ft) => ft.id === selectedTemplateId
  );

  useEffect(() => {
    if (initialData) {
      reset({
        formTemplateId: initialData.formTemplate.id,
        fieldValues: Object.fromEntries(
          initialData.fieldValues.map((fv) => [fv.formField.id, fv.fieldValue])
        ),
      });
    }
  }, [initialData, reset]);

  const renderField = (field: FormField) => {
    const { id, type, required } = field;
    const inputProps = {
      ...register(`fieldValues.${id}`, { required }),
      className: "w-full border rounded px-3 py-2",
    };

    switch (type.toUpperCase()) {
      case "TEXT":
      case "EMAIL":
      case "PASSWORD":
      case "NUMBER":
      case "DATE":
        return <input type={type.toLowerCase()} {...inputProps} />;
      case "TEXTAREA":
        return <textarea {...inputProps} />;
      default:
        return <input type="text" {...inputProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Form Template</label>
        <select
          {...register("formTemplateId", { required: true })}
          className="w-full border rounded px-3 py-2"
          disabled={!!initialData}
        >
          <option value="">Select a template</option>
          {formTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        {errors.formTemplateId && (
          <p className="text-red-500 text-sm">Form template is required</p>
        )}
      </div>

      {selectedTemplate &&
        selectedTemplate.fields.map((field) => (
          <div key={field.id}>
            <label className="block font-medium mb-1">{field.label}</label>
            {renderField(field)}
            {errors.fieldValues?.[field.id] && (
              <p className="text-red-500 text-sm">This field is required</p>
            )}
          </div>
        ))}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {initialData ? "Update Employee" : "Create Employee"}
      </button>
    </form>
  );
}
