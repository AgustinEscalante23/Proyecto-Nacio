document.getElementById("socios-form").addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('id-socio')?.value;
    const formData = new FormData(event.target);
    let url = `http://127.0.0.1:8000/api/socios/`;
    let method = 'POST';
    if (id) {
        url += `${id}/`
        method = 'PUT'
    };
    fetch(url, {
        method: method,
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Socio creado/actualizado:', data);
        resetForm()
        fetchSocios(); // Actualizar la lista de socios después de agregar
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Función para obtener y mostrar los socios
function fetchSocios() {
    fetch('http://127.0.0.1:8000/api/socios/')
        .then(response => response.json())
        .then(data => {
            const sociosList = document.getElementById('socio-list-body');
            sociosList.innerHTML = ''; // Limpiar la lista existente
            data.forEach(socio => {
                console.log(socio)
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${socio.Nombre_Completo}</td>
                    <td>${socio.Documento}</td>
                    <td>${socio.Telefono}</td>
                    <td>${socio.Domicilio}</td>
                    <td>
                        <button onclick="deleteSocio(${socio.id})">Eliminar</button>
                        <button onclick="editSocio(${socio.id})">Editar</button>
                    </td>
                `;
                sociosList.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar un socio
function deleteSocio(id) {
    fetch(`http://127.0.0.1:8000/api/socios/${id}/`, {  // Asegúrate de que la URL está dentro de comillas invertidas
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Socio eliminado');
            fetchSocios(); // Actualizar la lista después de eliminar
        } else {
            console.error('Error al eliminar:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para editar un socio
function editSocio(id) {
    const form = document.getElementById("socios-form")
    fetch(`http://127.0.0.1:8000/api/socios/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("Nombre_Completo").value = data.Nombre_Completo;
            document.getElementById("Documento").value = data.Documento;
            document.getElementById("Telefono").value = data.Telefono;
            document.getElementById("Domicilio").value = data.Domicilio;

            document.getElementById("cancelar").style.display = "inline";
            document.getElementById("enviar").textContent = "Actualizar Socio";

            let hiddenInput = document.getElementById("id-socio");
            if (!hiddenInput) {
                hiddenInput = document.createElement('input');
                hiddenInput.type = "hidden";
                hiddenInput.id = "id-socio";
                hiddenInput.name = "id";
                hiddenInput.value = id;
            } else {
                hiddenInput.value = id;
            }
            form.appendChild(hiddenInput)
        }
        ).catch(error => console.error('Error:', error));
}

function resetForm () {
    const form = document.getElementById("socios-form");
    const idElement = document.getElementById("id-socio");
    const cancelarBtn = document.getElementById("cancelar");
    const enviarBtn = document.getElementById("enviar");

    if (form) form.reset();
    if (idElement) idElement.remove();
    if (cancelarBtn) cancelarBtn.style.display = "none";
    if (enviarBtn) enviarBtn.textContent = "Agregar Socio";
}
// Obtener los socios al cargar la página
document.addEventListener('DOMContentLoaded', fetchSocios());
{    
}

