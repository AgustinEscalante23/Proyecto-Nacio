from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Producto, Estado, Categoria
from .serializers import ProductoSerializer, EstadoSerializer, CategoriaSerializer, ProductoReadSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    
    def get_serializer_class(self):
        """Usa un serializer distinto para GET y para las demás operaciones."""
        if self.action in ["list", "retrieve"]:  
            return ProductoReadSerializer  # GET → Devuelve prestatario y productos completos
        return ProductoSerializer  # POST/PUT → Recibe prestatario y productos como IDs

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()  
        categoria_id = self.request.query_params.get("categoria")
        estado_id = self.request.query_params.get("estado")
        prestado_filtro = self.request.query_params.get("prestado", "").strip().lower()

        productosBuscados = Producto.objects.all()  # Inicialmente, trae todos los productos

        if query:
            productosBuscados = productosBuscados.filter(
                Q(nombre__icontains=query) | Q(codigo__icontains=query)
            )

        if estado_id and estado_id.isdigit():
            if int(estado_id) != 0:
                productosBuscados = productosBuscados.filter(estado__id=int(estado_id))
            else:
                productosBuscados = productosBuscados.filter(estado__isnull=True)

        if categoria_id and categoria_id.isdigit():
            if int(categoria_id) != 0:
                productosBuscados = productosBuscados.filter(categoria__id=int(categoria_id))
            else:
                productosBuscados = productosBuscados.filter(categoria__isnull=True)

        if prestado_filtro in ["true", "false"]:
            productosBuscados = productosBuscados.filter(prestado=(prestado_filtro == "true"))
            productosBuscados = productosBuscados.order_by('estado')
            return productosBuscados.distinct()

        return productosBuscados.distinct()
    
    def list(self, request, *args, **kwargs):
        if request.query_params.get("count", "").lower() == "true":
            cantidad = self.get_queryset().count()
            return Response({"cantidad": cantidad})  # Devuelve solo la cantidad

        return super().list(request, *args, **kwargs)  # Retorna productos normalmente

class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = EstadoSerializer
class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    permission_classes = [permissions.AllowAny]  # Definido como una lista
    serializer_class = CategoriaSerializer

