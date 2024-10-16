from rest_framework import routers
from .api import productoViewSet, estadoViewSet, categoriaViewSet
from django.urls import path, include
from .views import indexs, cargarcategoria, estado

router = routers.DefaultRouter()
router.register(r'producto',productoViewSet )
router.register(r'estado', estadoViewSet )
router.register(r'categoria', categoriaViewSet )

urlpatterns = [
    path('api_stock/', include(router.urls)),
    path('producto/', indexs, name='indexs'),
    path('estado/', estado, name='estado'),
    path('categoria/', cargarcategoria, name='categoria'),
]


