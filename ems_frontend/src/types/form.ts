export interface FieldOption {
  label: string;
  value: string;
}

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface FormField {
  id?: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired?: boolean;
  fieldOrder?: number;
  fieldOptions?: FieldOption[] | null;
  validationRules?: ValidationRules | null;
}

export interface FormTemplate {
  id?: number;
  name: string;
  description?: string;
  fields: FormField[];
}

export interface FormTemplatePayload {
  name: string;
  description?: string;
  fields: {
    field_name: string;
    field_label: string;
    field_type: string;
    is_required: boolean;
    field_order: number;
    fieldOptions?: FieldOption[] | null;
    validationRules?: ValidationRules | null;
  }[];
}
