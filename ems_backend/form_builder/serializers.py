from rest_framework import serializers

from .models import FormTemplate, FormField


class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        exclude = ['form_template']


class FormTemplateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = FormTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        fields_data = validated_data.pop('fields')
        form_template = FormTemplate.objects.create(**validated_data)
        for field_data in fields_data:
            FormField.objects.create(form_template=form_template, **field_data)
        return form_template
    
    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        instance.fields.all().delete()
        for field_data in fields_data:
            FormField.objects.create(form_template=instance, **field_data)

        return instance
