@echo off

REM Activar el entorno virtual
call env\Scripts\activate.bat

REM Iniciar el servidor sin mostrar mensajes
python manage.py runserver > nul 2>&1