from django.db.models import Q
from django.shortcuts import render
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets
from .models import Prestamo, socios
from .serializers import PrestamoReadSerializer, PrestamoWriteSerializer
from rest_framework.response import Response

def prestamos(request):
    return render(request, 'prestamos.html')

class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    
    def get_serializer_class(self):
        """Usa un serializer distinto para GET y para las demás operaciones."""
        if self.action in ["list", "retrieve"]:  
            return PrestamoReadSerializer  # GET → Devuelve prestatario y productos completos
        return PrestamoWriteSerializer  # POST/PUT → Recibe prestatario y productos como IDs

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()  # Elimina espacios extra
        estado = self.request.query_params.get("estado", "").strip().lower()
        filtro_fecha = self.request.query_params.get("fecha", "").strip().lower()

        prestamos = Prestamo.objects.all()  # Inicialmente, trae todos los préstamos

        if query:
            prestamos = prestamos.filter(
                Q(prestatario__Nombre_Completo__icontains=query) | Q(prestatario__Documento__startswith=query)
            )

        if estado in ["true", "false"]:
            prestamos = prestamos.filter(finalizado=(estado == "true"))

        if filtro_fecha == "vencimiento":
            fecha_actual = timezone.now().date()
            fecha_limite = fecha_actual + timedelta(days=7)
            prestamos = prestamos.filter(
                Q(fecha_devolucion__lt=fecha_actual) | 
                Q(fecha_devolucion__range=[fecha_actual, fecha_limite])
            )
            return prestamos.order_by("fecha_devolucion")

        return prestamos

    



