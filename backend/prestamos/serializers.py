from rest_framework import serializers
from .models import Prestamo, socios, Producto
from socios.serializers import SociosSerializer
from stock.serializers import ProductoSerializer

class PrestamoWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prestamo
        fields = '__all__'

class PrestamoReadSerializer(serializers.ModelSerializer):
    prestatario = SociosSerializer(read_only=True)
    productos = ProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Prestamo
        fields = ['id', 'prestatario', 'productos', 'duracion', 'fecha_extraccion', 'fecha_devolucion', 'finalizado' ]

