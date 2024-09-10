from django.db import models

# Create your models here.

class socios(models.Model):
    Nombre_Completo = models.CharField(max_length=30)
    Documento = models.IntegerField(max_length=12)
    Iden_persona = models.IntegerField(max_length=10)
    Telefono = models.IntegerField(max_length=12)
    Domicilio = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"