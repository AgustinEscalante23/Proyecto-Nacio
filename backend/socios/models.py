from django.db import models

# Create your models here.

class socios(models.Model):
    Iden_persona = models.AutoField(primary_key=True)
    Nombre_Completo = models.CharField(max_length=30)
    Documento = models.IntegerField()
    Telefono = models.IntegerField()
    Domicilio = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"