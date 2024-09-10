// Obtener todas las tareas
fetch('/api/tareas/')
  .then(response => response.json())
  .then(data => {
    // Procesa los datos recibidos
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Crear una nueva tarea
const nuevaTarea = { titulo: 'Nueva Tarea', descripcion: 'Descripción de la nueva tarea' };

fetch('/api/tareas/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(nuevaTarea),
})
  .then(response => response.json())
  .then(data => {
    console.log('Tarea creada:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });