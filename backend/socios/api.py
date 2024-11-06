from rest_framework import viewsets, permissions
from .models import socios
from .serializers import SociosSerializer

class SociosViewSet(viewsets.ModelViewSet):
    queryset = socios.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = SociosSerializer
