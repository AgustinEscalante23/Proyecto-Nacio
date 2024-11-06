from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class socios(models.Model):
    Nombre_Completo = models.CharField(max_length=30)
    Documento = models.IntegerField()
    Telefono = models.IntegerField()  # Assuming a 10-digit phone number
    Domicilio = models.CharField(max_length=100)  # Increased max_length for better address handling

    def __str__(self):
        return self.Nombre_Completo