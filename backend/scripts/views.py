from rest_framework.response import Response
from rest_framework.decorators import api_view
import subprocess
from pathlib import Path

@api_view(['POST'])  # Solo permite solicitudes POST para ejecutar el backup
def ejecutar_backup(request):
    try:
        # Obtener la ruta del script
        ruta_script = Path(__file__).resolve().parent / "backup.py"

        # Ejecutar el script de backup
        subprocess.Popen(["python", (ruta_script)], start_new_session=True)
        return Response({"mensaje": "Backup iniciado correctamente"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=500)