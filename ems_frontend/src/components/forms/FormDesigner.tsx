import { useEffect, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FormField, FormTemplate } from "../../types/form";

interface FormDesignerProps {
  initialData: FormTemplate | null;
  onSubmit: (form: FormTemplate) => void;
}

interface SortableFieldProps {
  field: FormField;
  index: number;
  onTypeChange: (index: number, type: string) => void;
  onLabelChange: (index: number, label: string) => void;
}

const fieldTypes = [
  { type: "TEXT", label: "Text" },
  { type: "NUMBER", label: "Number" },
  { type: "EMAIL", label: "Email" },
  { type: "DATE", label: "Date" },
  { type: "PASSWORD", label: "Password" },
];

const sanitizeFields = (rawFields: FormField[]): FormField[] => {
  return rawFields.map((f, idx) => ({
    id: f.id ?? `field-${idx}`,
    fieldLabel: f.fieldLabel ?? `Field ${idx + 1}`,
    fieldName: f.fieldName ?? `field_${idx + 1}`,
    fieldType: f.fieldType ?? "TEXT",
    isRequired: f.isRequired ?? false,
    fieldOrder: f.fieldOrder ?? idx,
    fieldOptions: f.fieldOptions ?? null,
    validationRules: f.validationRules ?? null,
  }));
};

function SortableField({
  field,
  index,
  onTypeChange,
  onLabelChange,
}: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id ?? `field-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border rounded mb-2 bg-gray-50 shadow"
    >
      <div className="flex gap-3 items-start">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab pt-6 px-2 text-gray-500"
          title="Drag to reorder"
        >
          ☰
        </div>

        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Label</label>
          <input
            type="text"
            value={field.fieldLabel || ""}
            onChange={(e) => onLabelChange(index, e.target.value)}
            className="w-full p-2 border rounded bg-white text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Type</label>
          <select
            value={field.fieldType}
            onChange={(e) => onTypeChange(index, e.target.value)}
            className="p-2 border rounded w-28"
          >
            {fieldTypes.map((f) => (
              <option key={f.type} value={f.type}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function FormDesigner({
  initialData,
  onSubmit,
}: FormDesignerProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [fields, setFields] = useState<FormField[]>(
    initialData?.fields ? sanitizeFields(initialData.fields) : []
  );
  console.log("initialData:", initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setFields(initialData.fields ? sanitizeFields(initialData.fields) : []);
    }
  }, [initialData]);

  const handleAddField = () => {
    const newField: FormField = {
      id: Math.random().toString(),
      fieldName: "",
      fieldLabel: `Field ${fields.length + 1}`,
      fieldType: "TEXT",
      isRequired: false,
      fieldOrder: fields.length,
      fieldOptions: null,
      validationRules: null,
    };
    setFields([...fields, newField]);
  };

  const handleFieldTypeChange = (index: number, type: string) => {
    const newFields = [...fields];
    newFields[index].fieldType = type;
    setFields(newFields);
  };

  const handleFieldLabelChange = (index: number, label: string) => {
    const newFields = [...fields];
    newFields[index].fieldLabel = label;
    setFields(newFields);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      setFields((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleSubmit = () => {
    const transformedFields = fields.map((field, index) => {
      const safeLabel = field.fieldLabel?.trim() || `Field ${index + 1}`;
      return {
        ...field,
        fieldLabel: safeLabel,
        fieldName: safeLabel.toLowerCase().replace(/\s+/g, "_"),
        fieldType: field.fieldType ?? "TEXT", // ✅ Ensure field_type is always present
        fieldOrder: index,
      };
    });

    const payload: FormTemplate = {
      ...initialData,
      name: name.trim(),
      description: description.trim(),
      fields: transformedFields,
    };

    console.log("Payload being submitted:", payload);
    onSubmit(payload);
  };

  return (
    <div>
      <input
        className="w-full mb-2 p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Form Name"
      />
      <textarea
        className="w-full mb-2 p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Form Description"
      />

      <div className="mb-4">
        <button
          onClick={handleAddField}
          className="bg-blue-100 px-4 py-1 rounded text-sm border"
        >
          + Add Field
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map((f, i) => f.id ?? `field-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <SortableField
              key={field.id}
              field={field}
              index={index}
              onTypeChange={handleFieldTypeChange}
              onLabelChange={handleFieldLabelChange}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
