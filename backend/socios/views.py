from django.shortcuts import render
from django.http import JsonResponse
from .models import socios  # Asegúrate de importar tu modelo
from rest_framework import viewsets
from .serializers import SociosSerializer

def index(request):
    return render(request, 'index.html')

class SociosViewSet(viewsets.ModelViewSet):
    queryset = socios.objects.all()
    serializer_class = SociosSerializer

def get_socios(request):
    if request.method == 'GET':
        socios_list = list(socios.objects.values())  # Cambia Socio por socios
        return JsonResponse(socios_list, safe=False)  # Devuelve como JSON

# Agrega las vistas para crear, editar y eliminar si no están definidas.
