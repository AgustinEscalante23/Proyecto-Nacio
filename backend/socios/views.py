from django.shortcuts import render
from django.db.models import Q
from django.http import JsonResponse
from .models import socios, cuotas, verificar_y_crear_cuotas # Asegúrate de importar tu modelo
from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import SociosSerializer, CuotasWriteSerializer, CuotasReadSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

def opciones(request):
    return render(request, 'opciones.html')

def index(request):
    return render(request, 'index.html')

def socios_index(request):
    return render(request, "socios.html")

class SociosViewSet(viewsets.ModelViewSet):
    queryset = socios.objects.all()
    serializer_class = SociosSerializer

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()  # Elimina espacios extra
        estado = self.request.query_params.get("Asociado", "").strip().lower()

        socioslist = socios.objects.all()  # Inicialmente, trae todas las cuotas

        if query:
            socioslist = socioslist.filter(
                Q(Nombre_Completo__icontains=query) | Q(Documento__startswith=query)
            )

        if estado in ["true", "false"]:
            socioslist = socioslist.filter(Asociado=(estado == "true"))

        return socioslist.order_by("Nombre_Completo")

class BuscarSociosView(APIView):
    def get (self, request, *args, **kwargs):
        query = request.GET.get('q', '')  # Obtener el valor de búsqueda

        if query.isdigit():  # Si el input es un número, buscar por Documento
            sociosBuscados = socios.objects.filter(Documento__startswith=int(query))
        else:  # Si no es un número, buscar por Nombre_Completo
            sociosBuscados = socios.objects.filter(Nombre_Completo__icontains=query)

        serializer = SociosSerializer(sociosBuscados, many=True)
        return Response(serializer.data)

def get_socios(request):
    if request.method == 'GET':
        socios_list = list(socios.objects.values())  # Cambia Socio por socios
        return JsonResponse(socios_list, safe=False)  # Devuelve como JSON

class CuotasViewSet(viewsets.ModelViewSet):
    queryset = cuotas.objects.all()
    
    def get_serializer_class(self):
        """Usa un serializer distinto para GET y para las demás operaciones."""
        if self.action in ["list", "retrieve"]:  
            return CuotasReadSerializer
        return CuotasWriteSerializer
    
    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()  # Elimina espacios extra
        estado = self.request.query_params.get("completas", "").strip().lower()

        cuotaslist = cuotas.objects.all()  # Inicialmente, trae todas las cuotas

        if query:
            cuotaslist = cuotaslist.filter(
                Q(socio__Nombre_Completo__icontains=query) | Q(socio__Documento__startswith=query)
            )

        if estado in ["true", "false"]:
            cuotaslist = cuotaslist.filter(completas=(estado == "true"))

        return cuotaslist.order_by("socio__Nombre_Completo")
    


@api_view(['POST'])
def ejecutar_verificacion_cuotas(request):
    verificar_y_crear_cuotas()
    return Response({"mensaje": "Cuotas verificadas y creadas si era necesario."}, status=200)


