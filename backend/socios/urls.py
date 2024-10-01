from rest_framework import routers
from .api import SociosViewSet
from django.urls import path, include
from .views import index

router = routers.DefaultRouter()
router.register(r'socios', SociosViewSet)

urlpatterns = [
    path('api_socios/', include(router.urls)),
    # path('', index, name='index'),
]