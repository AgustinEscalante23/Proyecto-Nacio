import os
import webview
import subprocess
import time
import signal
import platform
import sys
import psutil

if getattr(sys, 'frozen', False):
    # Si el código está empaquetado con PyInstaller
    BASE_DIR = os.path.dirname(sys.executable)
else:
    # Si estás ejecutando el código normalmente (no empaquetado)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

bat_path = os.path.join(BASE_DIR,'run_server.bat')

# Inicia el servidor Django
django_process = subprocess.Popen(bat_path, shell=True)


time.sleep(10)

# Abre la ventana de PyWebView con la URL del servidor Django
webview.create_window('ALPIC', 'http://127.0.0.1:8000/')
webview.start()

try:
    if platform.system() == "Windows":
        django_process.send_signal(signal.CTRL_BREAK_EVENT)  #En Windows, usa CTRL_BREAK para terminar
        django_process.send_signal(signal.CTRL_BREAK_EVENT)  #En Windows, usa CTRL_BREAK para terminar
    else:
        django_process.terminate()  # En sistemas Unix, usa terminate también
except Exception as e:
    print(f"Error al intentar cerrar el proceso: {e}")
finally:
    django_process.wait()  # Espera a que el proceso finalice completamente

# Función para matar cualquier proceso de Python activo al final del script
def kill_python_processes():
    current_pid = psutil.Process().pid  # PID del proceso actual
    for process in psutil.process_iter(['pid', 'name']):
        try:
            if process.info['name'] in ['python', 'python.exe'] and process.info['pid'] != current_pid:
                process.terminate()  # Termina el proceso
                print(f"Terminando proceso Python con PID: {process.info['pid']}")
        except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
            print(f"No se pudo terminar el proceso con PID {process.info['pid']}: {e}")

    # Forzar el cierre de los procesos que aún estén activos
    try:
        gone, alive = psutil.wait_procs([p for p in psutil.process_iter() if p.name() in ['python', 'python.exe']], timeout=3)
        for process in alive:
            process.kill()  # Mata cualquier proceso que aún esté vivo
    except (psutil.NoSuchProcess, psutil.AccessDenied) as e:
        print(f"Error al intentar forzar el cierre de procesos Python: {e}")

# Llama a la función para cerrar procesos al final del script
kill_python_processes()

