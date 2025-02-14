from rest_framework import routers
from .api import ProductoViewSet, EstadoViewSet, CategoriaViewSet
from django.urls import path, include
from .views import productos, cargarcategoria, estado, CategoriaDeleteView, EstadoDeleteView, ProductoDeleteView

router = routers.DefaultRouter()
router.register(r'producto', ProductoViewSet)
router.register(r'estado', EstadoViewSet)
router.register(r'categoria', CategoriaViewSet)

urlpatterns = [
    path('api_stock/', include(router.urls)),
    path('producto/', productos, name='productos'),
    path('estado/', estado, name='estado'),
    path('categoria/', cargarcategoria, name='categoria'),
    path('api_stock/categoria/<int:id>/', CategoriaDeleteView.as_view(), name='categoria-delete'),
    path('api_stock/estado/<int:id>/', EstadoDeleteView.as_view(), name='estado-delete'),
    path('api_stock/producto/<int:id>/', ProductoDeleteView.as_view(), name='producto-delete'),
]



