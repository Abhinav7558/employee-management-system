from django.db import models
from django.contrib.auth import get_user_model
from form_builder.models import FormTemplate, FormField


User = get_user_model()


class Employee(models.Model):
    form_template = models.ForeignKey(FormTemplate, on_delete=models.CASCADE, related_name="employees")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="employees")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class EmployeeFieldValue(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="field_values")
    form_field = models.ForeignKey(FormField, on_delete=models.CASCADE)
    field_value = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
