from rest_framework import serializers
from .models import socios, cuotas

class SociosSerializer(serializers.ModelSerializer):
    class Meta:
        model = socios
        fields = '__all__'

class CuotasReadSerializer(serializers.ModelSerializer):
    socio = SociosSerializer(read_only=True)

    class Meta:
        model = cuotas
        fields = ['id', 'socio', 'anio', 'cuota1', 'cuota2', 'cuota3', 'cuota4', 'cuota5', 'cuota6', 'completas']
    
class CuotasWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = cuotas
        fields = '__all__'

    def update(self, instance, validated_data):
        # Actualizar los valores de las cuotas
        for field in ['cuota1', 'cuota2', 'cuota3', 'cuota4', 'cuota5', 'cuota6']:
            setattr(instance, field, validated_data.get(field, getattr(instance, field)))

        # Verificar si todas las cuotas están pagadas
        instance.completas = all([instance.cuota1, instance.cuota2, instance.cuota3, instance.cuota4, instance.cuota5, instance.cuota6])
        instance.save()
        return instance