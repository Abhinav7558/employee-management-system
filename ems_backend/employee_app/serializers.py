from rest_framework import serializers
from .models import Employee, EmployeeFieldValue
from form_builder.models import FormTemplate, FormField
from form_builder.serializers import FormFieldSerializer


class EmployeeFieldValueSerializer(serializers.ModelSerializer):
    form_field = FormFieldSerializer(read_only=True)
    form_field_id = serializers.PrimaryKeyRelatedField(queryset=FormField.objects.all(), source="form_field", write_only=True)

    class Meta:
        model = EmployeeFieldValue
        fields = ["id", "form_field", "form_field_id", "field_value"]


class EmployeeSerializer(serializers.ModelSerializer):
    field_values = EmployeeFieldValueSerializer(many=True)
    form_template_id = serializers.PrimaryKeyRelatedField(queryset=FormTemplate.objects.all(), source="form_template")

    class Meta:
        model = Employee
        fields = ["id", "form_template_id", "created_by", "is_active", "created_at", "updated_at", "field_values"]
        read_only_fields = ["created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        field_values_data = validated_data.pop("field_values")
        validated_data.pop("created_by", None)
        
        employee = Employee.objects.create(created_by=self.context["request"].user, **validated_data)
        
        for field_value_data in field_values_data:
            EmployeeFieldValue.objects.create(employee=employee, **field_value_data)
    
        return employee


    def update(self, instance, validated_data):
        field_values_data = validated_data.pop("field_values")
        instance.form_template = validated_data.get("form_template", instance.form_template)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.save()

        instance.field_values.all().delete()
        for field_value_data in field_values_data:
            EmployeeFieldValue.objects.create(employee=instance, **field_value_data)

        return instance
