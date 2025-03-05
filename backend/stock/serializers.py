from rest_framework import serializers
from .models import Producto, Estado, Categoria

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoReadSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    estado = EstadoSerializer(read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

    codigo = serializers.CharField(required=False, read_only=True)  # No editable por el usuario