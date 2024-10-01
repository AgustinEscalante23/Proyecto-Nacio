from rest_framework import serializers
from .models import producto, estado, categoria


class productoSeralizer(serializers.ModelSerializer):
    class Meta:
        model = producto
        fields = '__all__'

class estadoSeralizer(serializers.ModelSerializer):
    class Meta:
        model = estado
        fields = '__all__'

class categotiaSeralizer(serializers.ModelSerializer):
    class Meta:
        model = categoria
        fields = '__all__'