from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Categoria, Estado, Producto
from .serializers import ProductoReadSerializer
from django.db.models import Q

def productos(request):
    return render(request, 'productos.html')

def cargarcategoria(request):
    return render(request, 'categoria.html')

def estado(request):
    return render(request, 'estado.html')


        
class BuscarProductosView(APIView):
    def get (self, request, *args, **kwargs):
        query = request.GET.get('q', '')  # Obtener el valor de búsqueda

        productosBuscados = Producto.objects.all()

        if query:  # Si hay una consulta
             # Filtrar por nombre, código o nombre de la categoría, insensible a mayúsculas/minúsculas
            productosBuscados = productosBuscados.filter(
                Q(nombre__icontains=query) | 
                Q(codigo__icontains=query) |
                Q(categoria__nombre__icontains=query)  # Filtra por nombre de categoría
            )
        # Filtrar los productos cuyo atributo 'prestado' sea False
        productosBuscados = productosBuscados.filter(prestado=False)

        # Serializar los productos encontrados
        serializer = ProductoReadSerializer(productosBuscados, many=True)
        return Response(serializer.data)
