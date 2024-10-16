from django.shortcuts import render

def indexs(request):
    return render(request, 'indexs.html')

def cargarcategoria(request):
    return render(request, 'categoria.html')

def estado(request):
    return render(request, 'estado.html')




