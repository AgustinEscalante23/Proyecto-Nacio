from rest_framework import viewsets, permissions
from .models import producto, estado, categoria
from .serializers import productoSeralizer, estadoSeralizer, categotiaSeralizer

class productoViewSet(viewsets.ModelViewSet):
    queryset = producto.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = productoSeralizer

class estadoViewSet(viewsets.ModelViewSet):
    queryset = estado.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = estadoSeralizer

class categoriaViewSet(viewsets.ModelViewSet):
    queryset = categoria.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = categotiaSeralizer

