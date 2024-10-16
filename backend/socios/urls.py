from rest_framework import routers
from .api import SociosViewSet
from django.urls import path, include
from .views import index

router = routers.DefaultRouter()
router.register(r'socios', SociosViewSet)

urlpatterns = [
<<<<<<< HEAD
    path('api/', include(router.urls)),
    path('socios/', index, name='socios'),
=======
    path('api_socios/', include(router.urls)),
    # path('', index, name='index'),
>>>>>>> 076e9054d494a2191575690a49149981258c8abc
]