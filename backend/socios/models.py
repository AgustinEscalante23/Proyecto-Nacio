from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.timezone import now

class socios(models.Model):
    Nombre_Completo = models.CharField(max_length=30)
    Documento = models.IntegerField()
    Telefono = models.IntegerField()  # Assuming a 10-digit phone number
    Domicilio = models.CharField(max_length=100)  # Increased max_length for better address handling
    Asociado = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Guarda el socio en la base de datos
        from .models import cuotas
        anio_actual = now().year
        if self.Asociado:
            cuotas.objects.get_or_create(socio=self, anio=anio_actual)  # Crea la cuota si no existe
        else:
            cuotas.objects.filter(socio=self, anio=anio_actual).delete()  # Elimina la cuota si deja de ser asociado

    def __str__(self):
        return self.Nombre_Completo
    
class cuotas(models.Model):
    socio = models.ForeignKey(socios, on_delete=models.CASCADE, related_name='cuotas')
    anio = models.IntegerField()
    cuota1 = models.BooleanField(default=False)
    cuota2 = models.BooleanField(default=False)
    cuota3 = models.BooleanField(default=False)
    cuota4 = models.BooleanField(default=False)
    cuota5 = models.BooleanField(default=False)
    cuota6 = models.BooleanField(default=False)
    completas = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Verificar si todas las cuotas son True
        self.completas = all([self.cuota1, self.cuota2, self.cuota3, self.cuota4, self.cuota5, self.cuota6])
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.socio.Nombre_Completo} - {self.anio}"


def verificar_y_crear_cuotas():
    anio_actual = now().year
    socios_asociados = socios.objects.filter(Asociado=True)
    
    for socio in socios_asociados:
        # Verificar si ya existe una cuota para el año actual
        if not cuotas.objects.filter(socio=socio, anio=anio_actual).exists():
            cuotas.objects.create(socio=socio, anio=anio_actual)
