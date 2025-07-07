import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Employee, EmployeeFormData } from "../../types/employee";
import type { FormTemplate, FormField } from "../../types/form";

type FieldTypeInput = string | { value: string };

interface InternalFormData {
  formTemplateId: number;
  fieldValues: Record<string, string>;
}

interface Props {
  initialData?: Employee | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formTemplates: any[];
  onSubmit: (data: EmployeeFormData) => void;
}

export default function EmployeeForm({
  initialData,
  formTemplates,
  onSubmit,
}: Props) {
  const normalizedTemplates: FormTemplate[] = useMemo(
    () =>
      formTemplates.map((template) => ({
        ...template,
        id: template.id,
        name: template.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fields: template.fields?.map((field: any) => ({
          id: field.id,
          fieldName: field.field_name,
          fieldLabel: field.field_label,
          fieldType: field.field_type,
          isRequired: field.is_required,
          fieldOrder: field.field_order,
          fieldOptions: field.field_options,
          validationRules: field.validation_rules,
        })),
      })),
    [formTemplates]
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InternalFormData>({
    defaultValues: {
      formTemplateId: initialData?.formTemplate?.id ?? undefined,
      fieldValues:
        initialData && Array.isArray(initialData.fieldValues)
          ? Object.fromEntries(
              initialData.fieldValues
                .filter((fv) => fv.formField?.id != null)
                .map((fv) => [fv.formField.id, fv.fieldValue])
            )
          : {},
    },
  });

  const selectedTemplateId = watch("formTemplateId");
  const selectedTemplate = normalizedTemplates.find(
    (ft) => ft.id === Number(selectedTemplateId)
  );

  useEffect(() => {
    if (
      initialData &&
      initialData.formTemplate?.id &&
      Array.isArray(initialData.fieldValues)
    ) {
      reset({
        formTemplateId: initialData.formTemplate.id,
        fieldValues: Object.fromEntries(
          initialData.fieldValues
            .filter((fv) => fv.formField?.id != null)
            .map((fv) => [fv.formField!.id, fv.fieldValue])
        ),
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (selectedTemplateId && !initialData) {
      setValue("fieldValues", {});
    }
  }, [selectedTemplateId, setValue, initialData]);

  const getFieldType = (fieldType: FieldTypeInput): string => {
    if (typeof fieldType === "object" && fieldType?.value) {
      return fieldType.value.toUpperCase();
    }
    if (typeof fieldType === "string") {
      return fieldType.toUpperCase();
    }
    return "TEXT";
  };

  const renderField = (field: FormField) => {
    const { id, fieldLabel, fieldType, isRequired, fieldOptions } = field;
    if (id == null) return null;
    const fieldTypeStr = getFieldType(fieldType);

    const inputProps = {
      ...register(`fieldValues.${id}`, {
        required: isRequired ? `${fieldLabel} is required` : false,
      }),
      className:
        "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      placeholder: `Enter ${fieldLabel}`,
    };

    switch (fieldTypeStr) {
      case "TEXT":
        return <input type="text" {...inputProps} />;
      case "EMAIL":
        return <input type="email" {...inputProps} />;
      case "PASSWORD":
        return <input type="password" {...inputProps} />;
      case "NUMBER":
        return <input type="number" {...inputProps} />;
      case "DATE":
        return <input type="date" {...inputProps} />;
      case "PHONE":
        return <input type="tel" {...inputProps} />;
      case "TEXTAREA":
        return (
          <textarea
            {...inputProps}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        );
      case "SELECT":
        return (
          <select {...inputProps}>
            <option value="">Select an option</option>
            {fieldOptions?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "CHECKBOX":
        return (
          <div className="space-y-2">
            {fieldOptions?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  {...register(`fieldValues.${id}`)}
                  value={option.value}
                  className="mr-2"
                />
                {option.value}
              </label>
            ))}
          </div>
        );
      case "RADIO":
        return (
          <div className="space-y-2">
            {fieldOptions?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  {...register(`fieldValues.${id}`, {
                    required: isRequired ? `${fieldLabel} is required` : false,
                  })}
                  value={option.value}
                  className="mr-2"
                />
                {option.value}
              </label>
            ))}
          </div>
        );
      case "FILE":
        return (
          <input
            type="file"
            {...register(`fieldValues.${id}`, {
              required: isRequired ? `${fieldLabel} is required` : false,
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      default:
        return <input type="text" {...inputProps} />;
    }
  };

  const getFieldError = (fieldId: string | number | undefined) => {
    if (fieldId == null) return null;
    const fieldErrors = errors.fieldValues?.[fieldId.toString()];
    return (
      fieldErrors?.message || (fieldErrors ? "This field is required" : null)
    );
  };

  const handleTransformedSubmit = (data: InternalFormData) => {
    const transformed: EmployeeFormData = {
      form_template_id: data.formTemplateId,
      field_values: Object.entries(data.fieldValues).map(
        ([form_field_id, field_value]) => ({
          form_field_id: Number(form_field_id),
          field_value,
        })
      ),
    };
    onSubmit(transformed);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit(handleTransformedSubmit)}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Template <span className="text-red-500">*</span>
          </label>
          <select
            {...register("formTemplateId", {
              required: "Form template is required",
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!!initialData}
          >
            <option value="">Select a template</option>
            {normalizedTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          {errors.formTemplateId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.formTemplateId.message}
            </p>
          )}
        </div>

        {selectedTemplate && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedTemplate.name} Fields
            </h3>
            {selectedTemplate.fields?.length > 0 ? (
              <div className="space-y-4">
                {selectedTemplate.fields
                  .filter((field) => field.id != null)
                  .sort((a, b) => (a.fieldOrder || 0) - (b.fieldOrder || 0))
                  .map((field) => (
                    <div
                      key={field.id}
                      className="bg-white p-4 rounded-md border"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.fieldLabel}{" "}
                        <span className="text-gray-400 text-xs">
                          ({getFieldType(field.fieldType)})
                        </span>
                        {field.isRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {renderField(field)}
                      {getFieldError(field.id) && (
                        <p className="text-red-500 text-sm mt-1">
                          {getFieldError(field.id)}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No fields defined for this template
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={!selectedTemplate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {initialData ? "Update Employee" : "Create Employee"}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
