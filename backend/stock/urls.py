from rest_framework import routers
from .api import ProductoViewSet, EstadoViewSet, CategoriaViewSet
from django.urls import path, include
from .views import productos, cargarcategoria, estado, BuscarProductosView

router = routers.DefaultRouter()
router.register(r'producto', ProductoViewSet)
router.register(r'estado', EstadoViewSet)
router.register(r'categoria', CategoriaViewSet)

urlpatterns = [
    path('api_stock/', include(router.urls)),
    path('producto/', productos, name='productos'),
    path('', productos, name='productos'),
    path('estado/', estado, name='estado'),
    path('categoria/', cargarcategoria, name='categoria'),
    path('api_stock/buscar-productos/', BuscarProductosView.as_view(), name='buscar_productos'),
]



