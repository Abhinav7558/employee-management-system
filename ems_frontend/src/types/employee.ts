import type { FormTemplate, FormField } from "./form";

export interface Employee {
  id: number;
  formTemplate: FormTemplate;
  createdBy: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fieldValues: EmployeeFieldValue[];
}

export interface EmployeeFieldValue {
  id: number;
  employee: number;
  formField: FormField;
  fieldValue: string;
}

export interface EmployeeFormData {
  form_template_id: number;
  field_values: {
    form_field_id: number;
    field_value: string;
  }[];
}
