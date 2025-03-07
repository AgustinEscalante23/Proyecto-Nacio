from rest_framework import routers
from .api import SociosViewSet
from django.urls import path, include
from .views import index, SociosViewSet, BuscarSociosView, CuotasViewSet, ejecutar_verificacion_cuotas, socios_index, opciones


router = routers.DefaultRouter()
router.register(r'socios', SociosViewSet)
router.register(r'cuotas', CuotasViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('personas/', index, name='personas'),
    path('socios/', socios_index, name='socios'),
    path('opciones/', opciones, name='opciones'),
    path('api/buscar-socios/', BuscarSociosView.as_view(), name='buscar_socios'),
    path('api/verificar-cuotas/', ejecutar_verificacion_cuotas, name='verificar_cuotas'),
]