from django.db import models, transaction

class Categoria(models.Model):
    nombre = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.nombre}"

    @classmethod
    def eliminar_y_reasignar_ids(cls, id):
        with transaction.atomic():
            cls.objects.filter(id=id).delete()
            categorias = cls.objects.all().order_by('id')
            for index, categoria in enumerate(categorias, start=1):
                categoria.id = index
                categoria.save()

class Estado(models.Model):
    nombre = models.CharField(max_length=30)

    def __str__(self):
        return f"{self.nombre}"

    @classmethod
    def eliminar_y_reasignar_ids(cls, id):
        with transaction.atomic():
            cls.objects.filter(id=id).delete()
            estados = cls.objects.all().order_by('id')
            for index, estado in enumerate(estados, start=1):
                estado.id = index
                estado.save()

class Producto(models.Model):
    nombre = models.CharField(max_length=30)
    estado = models.ForeignKey(Estado, on_delete=models.CASCADE)
    codigo = models.AutoField(primary_key=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    descripcion = models.TextField(max_length=300, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre}"

    @classmethod
    def eliminar_y_reasignar_ids(cls, id):
        with transaction.atomic():
            cls.objects.filter(codigo=id).delete()
            productos = cls.objects.all().order_by('codigo')
            for index, producto in enumerate(productos, start=1):
                producto.codigo = index
                producto.save()