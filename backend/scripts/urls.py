from django.urls import path
from .views import ejecutar_backup

urlpatterns = [
    path("backup/", ejecutar_backup, name="ejecutar_backup"),
]