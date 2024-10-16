
document.addEventListener('DOMContentLoaded', obtenerPersonas);

async function obtenerPersonas() {
    try{
        const response = await fetch('http://localhost:8000/api/socios/');
    const personas = await response.json();
    const lista = document.getElementById('socio-list-body');
    lista.innerHTML = '';

    personas.forEach(socio => {
        const tr = document.createElement('tr');
        tr.id = socio.id;
        tr.innerHTML = `
        <td>${ socio.Nombre_Completo }</td>
        <td>${ socio.Documento }</td>
        <td>${ socio.Iden_persona }</td>
        <td>${ socio.Telefono }</td>
        <td>${ socio.Domicilio }</td>
        <td><img src="${socio.foto}" alt="foto de ${socio.nombre}"></td>
        <td>
            <button onclick="eliminarSocio(${socio.id})">Eliminar</button>
            <button onclick="llenarFormulario(${socio.id})">Editar</button>
        </td>`;
        lista.appendChild(tr);
    });
    } catch (error) {
        console.log('Error fetching socio:', error);
    }
}


document.getElementById('socio-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const personaId = document.getElementById('socio-id')?.value;  // Tomamos el ID si existe (es decir, si es una modificación)
  let url = 'http://localhost:8000/api/socios/';
  let method = 'POST';  // Por defecto es creación

  if (personaId) {
      url += `${sociosId}/`;  // Si es una edición, modificamos la URL
      method = 'PUT';  // Método PUT para actualizar
  }

  try {
      const response = await fetch(url, {
          method: method,
          body: formData,
      });

      if (response.ok) {
        document.getElementById('socio-form').reset();  // Limpiar el formulario
      } else {
          const errorData = await response.json();
          console.error('Error al enviar datos:', errorData);
      }
  } catch (error) {
      console.error('Error en la solicitud:', error);
  }
});