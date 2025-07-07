import type { FormField } from "../../types/form";

export default function FormPreview({ fields }: { fields: FormField[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
      <form className="space-y-3">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm mb-1">
              {field.fieldLabel ?? "Unnamed Field"}
            </label>
            <input
              type={(field.fieldType ?? "text").toLowerCase()}
              className="w-full p-2 border rounded"
              placeholder={field.fieldLabel ?? ""}
            />
          </div>
        ))}
      </form>
    </div>
  );
}
