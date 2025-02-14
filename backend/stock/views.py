from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Categoria, Estado, Producto

def productos(request):
    return render(request, 'productos.html')

def cargarcategoria(request):
    return render(request, 'categoria.html')

def estado(request):
    return render(request, 'estado.html')

class CategoriaDeleteView(APIView):
    def delete(self, request, id):
        try:
            Categoria.eliminar_y_reasignar_ids(id)
            return Response({"message": "Categoría eliminada y IDs reasignados"}, status=status.HTTP_200_OK)
        except Categoria.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

class EstadoDeleteView(APIView):
    def delete(self, request, id):
        try:
            Estado.eliminar_y_reasignar_ids(id)
            return Response({"message": "Estado eliminado y IDs reasignados"}, status=status.HTTP_200_OK)
        except Estado.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

class ProductoDeleteView(APIView):
    def delete(self, request, id):
        try:
            Producto.eliminar_y_reasignar_ids(id)
            return Response({"message": "Producto eliminado y IDs reasignados"}, status=status.HTTP_200_OK)
        except Producto.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
