from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework.exceptions import NotFound

from .models import FormTemplate, FormField
from .serializers import FormTemplateSerializer


class FormTemplateViewSet(viewsets.ModelViewSet):
    queryset = FormTemplate.objects.all().order_by('-created_at')
    serializer_class = FormTemplateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search')
        is_active = self.request.query_params.get('is_active')

        if search:
            queryset = queryset.filter(Q(name__icontains=search))

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')

        return queryset
    
    def get_object(self):
        try:
            return super().get_object()
        except Http404:
            raise NotFound(detail="Form template not found.")
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if not queryset.exists():
            return Response({"message": "No forms available"}, status=status.HTTP_200_OK)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        try:
            original = self.get_object()
            duplicated = FormTemplate.objects.create(
                name=f"{original.name} (Copy)",
                description=original.description,
                created_by=request.user,
                is_active=original.is_active
            )

            for field in original.fields.all():
                FormField.objects.create(
                    form_template=duplicated,
                    field_name=field.field_name,
                    field_label=field.field_label,
                    field_type=field.field_type,
                    is_required=field.is_required,
                    field_order=field.field_order,
                    field_options=field.field_options,
                    validation_rules=field.validation_rules
                )

            serializer = self.get_serializer(duplicated)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
