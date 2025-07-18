# Generated by Django 5.2.4 on 2025-07-06 06:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="FormTemplate",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("description", models.TextField(blank=True)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "created_by",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="FormField",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("field_name", models.CharField(max_length=100)),
                ("field_label", models.CharField(max_length=100)),
                (
                    "field_type",
                    models.CharField(
                        choices=[
                            ("TEXT", "Text"),
                            ("NUMBER", "Number"),
                            ("DATE", "Date"),
                            ("PASSWORD", "Password"),
                            ("EMAIL", "Email"),
                            ("PHONE", "Phone"),
                            ("TEXTAREA", "Textarea"),
                            ("SELECT", "Select"),
                            ("CHECKBOX", "Checkbox"),
                            ("RADIO", "Radio"),
                            ("FILE", "File"),
                        ],
                        max_length=20,
                    ),
                ),
                ("is_required", models.BooleanField(default=False)),
                ("field_order", models.IntegerField()),
                ("field_options", models.JSONField(blank=True, null=True)),
                ("validation_rules", models.JSONField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "form_template",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="fields",
                        to="form_builder.formtemplate",
                    ),
                ),
            ],
        ),
    ]
