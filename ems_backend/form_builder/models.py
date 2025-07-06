from django.db import models
from django.contrib.auth.models import User


class FormTemplate(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FormField(models.Model):
    FIELD_TYPES = [
        ('TEXT', 'Text'),
        ('NUMBER', 'Number'),
        ('DATE', 'Date'),
        ('PASSWORD', 'Password'),
        ('EMAIL', 'Email'),
        ('PHONE', 'Phone'),
        ('TEXTAREA', 'Textarea'),
        ('SELECT', 'Select'),
        ('CHECKBOX', 'Checkbox'),
        ('RADIO', 'Radio'),
        ('FILE', 'File'),
    ]

    form_template = models.ForeignKey(FormTemplate, on_delete=models.CASCADE, related_name='fields')
    field_name = models.CharField(max_length=100)
    field_label = models.CharField(max_length=100)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES)
    is_required = models.BooleanField(default=False)
    field_order = models.IntegerField()
    field_options = models.JSONField(blank=True, null=True)
    validation_rules = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
