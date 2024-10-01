from django.db import models

class categoria(models.Model):
    nombre= models.CharField(max_length=30 )

    def __str__(self):
        return f"{self.nombre}"

    
class estado(models.Model):
    nombre= models.CharField(max_length=30 )

    
    def __str__(self):
        return f"{self.nombre}"

class producto(models.Model):
    nombre= models.CharField(max_length=30)
    estado = models.ForeignKey(estado, on_delete=models.CASCADE)
    codigo = models.IntegerField(max_length=10)
    categoria = models.ForeignKey(categoria, on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=20)


    def __str__(self):
        return f"{self.nombre}"
    
    
    


