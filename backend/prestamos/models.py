from django.db import models
from datetime import timedelta
from django.utils import timezone
from socios.models import socios
from stock.models import Producto

class Prestamo(models.Model):
    prestatario = models.ForeignKey(socios, on_delete=models.CASCADE)
    productos = models.ManyToManyField(Producto)
    duracion = models.PositiveIntegerField()  # Duración en meses
    fecha_extraccion = models.DateField(default=timezone.localdate)  # Fecha en que se realiza el préstamo
    fecha_devolucion = models.DateField(blank=True, null=True)  # Fecha de devolución, que se calculará
    finalizado = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Calcular la fecha de devolución sumando la duración al campo fecha_extraccion
        if self.fecha_extraccion and self.duracion:
            self.fecha_devolucion = self.fecha_extraccion + timedelta(days=self.duracion * 30)  # Aproximación de 30 días por mes

        super(Prestamo, self).save(*args, **kwargs)

    def __str__(self):
        return f"Préstamo de {self.prestatario.Nombre_Completo} por {self.duracion} meses"