import { useState } from "react";
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
import FormPreview from "./FormPreview";

interface FormDesignerProps {
  initialData: FormTemplate | null;
  onSubmit: (form: FormTemplate) => void;
}

interface SortableFieldProps {
  field: FormField;
  index: number;
  onChange: (index: number, updated: FormField) => void;
}

const fieldTypes = [
  { type: "TEXT", label: "Text" },
  { type: "NUMBER", label: "Number" },
  { type: "EMAIL", label: "Email" },
  { type: "DATE", label: "Date" },
];

function SortableField({ field, index, onChange }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 border rounded mb-2 bg-gray-50 shadow"
    >
      <input
        type="text"
        value={field.label}
        onChange={(e) => onChange(index, { ...field, label: e.target.value })}
        placeholder="Label"
        className="w-full p-1 border mb-1"
      />
      <p className="text-sm text-gray-600">{field.type}</p>
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
  const [fields, setFields] = useState<FormField[]>(initialData?.fields || []);

  const handleAddField = (type: string) => {
    const newField: FormField = {
      id: Math.random().toString(),
      label: `${type} Field`,
      type,
    } as FormField;
    setFields([...fields, newField]);
  };

  const handleFieldChange = (index: number, updated: FormField) => {
    const newFields = [...fields];
    newFields[index] = updated;
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
    onSubmit({ ...initialData, name, description, fields } as FormTemplate);
  };

  return (
    <div>
      <input
        className="w-full mb-2 p-2 border"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Form Name"
      />
      <textarea
        className="w-full mb-2 p-2 border"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Form Description"
      />

      <div className="mb-4 flex gap-2 flex-wrap">
        {fieldTypes.map((f) => (
          <button
            key={f.type}
            onClick={() => handleAddField(f.type)}
            className="bg-blue-100 px-2 py-1 rounded text-sm"
          >
            + {f.label}
          </button>
        ))}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <SortableField
              key={field.id}
              field={field}
              index={index}
              onChange={handleFieldChange}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>

      <hr className="my-4" />
      <FormPreview fields={fields} />
    </div>
  );
}
