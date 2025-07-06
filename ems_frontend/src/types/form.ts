export interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface FormTemplate {
  id?: number;
  name: string;
  description?: string;
  fields: FormField[];
}
