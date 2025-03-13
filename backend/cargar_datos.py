import json
import os
import django

# Configura tu entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Alpic.settings')
django.setup()

from stock.models import Producto, Estado, Categoria
from socios.models import socios

# Cargar productos
with open('productos.json', 'r', encoding='utf-8') as f:
    productos = json.load(f)
    for prod in productos:
        categoria = Categoria.objects.get(id=prod['categoria']) if prod['categoria'] else None
        estado = Estado.objects.get(id=prod['estado']) if prod['estado'] else None
        Producto.objects.create(
            nombre=prod['nombre'],
            estado=estado,
            categoria=categoria,
            descripcion=prod['descripcion'],
            prestado=prod['prestado']
        )

# Cargar socios
with open('socios.json', 'r', encoding='utf-8') as f:
    Socios = json.load(f)
    for socio in Socios:
        socios.objects.create(
            Nombre_Completo=socio['Nombre_Completo'],
            Documento=socio['Documento'],
            Telefono=socio['Telefono'],
            Domicilio=socio['Domicilio'],
            Asociado=socio['Asociado']
        )

print("Datos cargados exitosamente.")