from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Producto, Estado, Categoria
from .serializers import ProductoSerializer, EstadoSerializer, CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = EstadoSerializer
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = CategoriaSerializer

