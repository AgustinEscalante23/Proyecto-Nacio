import os
import shutil
import tkinter as tk
from tkinter import filedialog, messagebox
from datetime import datetime
from tkinter import PhotoImage

# Ruta del proyecto Django (ajustar si es necesario)
RUTA_PROYECTO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..")) 
NOMBRE_DB = "db.sqlite3"

def hacer_copia_seguridad():
    """Crea una copia de seguridad de la base de datos SQLite"""
    if not os.path.exists(os.path.join(RUTA_PROYECTO, NOMBRE_DB)):
        messagebox.showerror("Error", "No se encontró la base de datos.")
        return
    
    # Nombre de la carpeta con fecha y hora
    fecha_hora = datetime.now().strftime("%d_%m_%y_%H_%M_%S")
    carpeta_backup = f"Copia_de_Seguridad_Alpic_{fecha_hora}"

    # Pedir al usuario dónde guardar la copia
    ruta_destino = filedialog.askdirectory(title="Seleccione la ubicación para la copia de seguridad")
    if not ruta_destino:
        return  # Usuario canceló la selección

    # Crear la carpeta y copiar la base de datos
    ruta_backup = os.path.join(ruta_destino, carpeta_backup)
    os.makedirs(ruta_backup, exist_ok=True)
    shutil.copy2(os.path.join(RUTA_PROYECTO, NOMBRE_DB), os.path.join(ruta_backup, NOMBRE_DB))

    messagebox.showinfo("Éxito", f"Copia de seguridad guardada en:\n{ruta_backup}")

def restaurar_datos():
    """Restaura la base de datos desde una copia de seguridad"""
    ruta_copia = filedialog.askdirectory(title="Seleccione la carpeta de la copia de seguridad")
    if not ruta_copia:
        return  # Usuario canceló la selección

    archivo_backup = os.path.join(ruta_copia, NOMBRE_DB)
    
    if not os.path.exists(archivo_backup):
        messagebox.showerror("Error", "No se encontró el archivo de base de datos en la carpeta seleccionada.")
        return

    # Restaurar la base de datos
    shutil.copy2(archivo_backup, os.path.join(RUTA_PROYECTO, NOMBRE_DB))
    messagebox.showinfo("Éxito", "Datos restaurados correctamente.")

# Crear la ventana principal
root = tk.Tk()
root.title("Gestión de Copias de Seguridad")
root.geometry("400x200")
# Obtén la ruta absoluta del archivo en relación con el directorio actual
icon_path = os.path.join(os.path.dirname(__file__), 'alpic_icon.ico')
root.iconbitmap(icon_path)  # Usa la ruta obtenida

# Crear botones
btn_backup = tk.Button(root, text="Hacer copia de seguridad", command=hacer_copia_seguridad, bg="#182240", fg="white", font=("Arial", 12), padx=10, pady=5)
btn_restore = tk.Button(root, text="Restaurar datos", command=restaurar_datos, bg="#182240", fg="white", font=("Arial", 12), padx=10, pady=5)

# Posicionar los botones
btn_backup.pack(pady=20)
btn_restore.pack(pady=10)

# Ejecutar la interfaz
root.mainloop()
