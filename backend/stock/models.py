from django.db import models, transaction
import random
import string

class Categoria(models.Model):
    nombre = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.nombre}"


class Estado(models.Model):
    nombre = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.nombre}"



class Producto(models.Model):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=30)
    estado = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True)
    codigo = models.CharField(max_length=6, unique=True, editable=False)
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True)
    descripcion = models.TextField(max_length=300, null=True, blank=True)
    prestado = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre} - {self.codigo}"

    def save(self, *args, **kwargs):
        if not self.codigo:  # Si el código aún no ha sido asignado
            self.codigo = self.generar_codigo_unico()
        super().save(*args, **kwargs)

    def generar_codigo_unico(self):
        """Genera un código único de 3 letras mayúsculas + 3 números (ejemplo: ABC123)"""
        with transaction.atomic():
            while True:
                codigo = ''.join(random.choices(string.ascii_uppercase, k=3)) + ''.join(random.choices(string.digits, k=3))
                if not Producto.objects.filter(codigo=codigo).exists():
                    return codigo

