from rest_framework import viewsets, permissions
from .models import Employee
from .serializers import EmployeeSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.prefetch_related("field_values").all()
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ["form_template", "is_active"]
    search_fields = ["field_values__field_value"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
