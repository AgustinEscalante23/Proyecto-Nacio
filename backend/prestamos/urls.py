from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrestamoViewSet, prestamos

router = DefaultRouter()
router.register(r'prestamos', PrestamoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('prestamos/', prestamos, name='prestamos'),
]