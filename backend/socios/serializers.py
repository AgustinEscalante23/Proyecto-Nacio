from rest_framework import serializers
from .models import socios

class SociosSerializer(serializers.ModelSerializer):
    class Meta:
        model = socios
        fields = '__all__'