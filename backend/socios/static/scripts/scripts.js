document.getElementById("socios-form").addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('id-socio')?.value;
    const formData = new FormData(event.target);
    const Asociado = document.getElementById("Asociado").value === "true";
    formData.set("Asociado", Asociado)
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
        fetchSocios(""); // Actualizar la lista de socios después de agregar
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Función para obtener y mostrar los socios
function fetchSocios(query, estado) {
    fetch(`http://127.0.0.1:8000/api/socios/?q=${query}&Asociado=${estado}`)
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
                    ${renderAsociado(socio.Asociado, socio.Nombre_Completo, socio.Documento, socio.id)}
                    <td>
                        <button onclick="deleteSocio(${socio.id})">🗑️ Eliminar</button>
                        <button onclick="editSocio(${socio.id})">✏️ Editar</button>
                    </td>
                `;
                sociosList.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
}

function renderAsociado(estado, nombre, dni, id) {
    return `
        <td onclick="cambiarAsociado(${estado}, '${nombre}', '${dni}', ${id})"
        style="color: ${estado ? 'green' : 'red'}; font-weight: bold; cursor: pointer;">
            ${estado ? 'SÍ ✅' : 'NO ❌'}
        </td>
    `;
}

function cambiarAsociado(estado, nombre, dni, id) {
    if (confirm(`¿Desea que ${nombre} - DNI: ${dni} ${!estado? "sea Socio ✅" : "deje de ser Socio ❌"}?`)) {
        
        console.log(`Cambiando estado de Socio id: ${id} Nombre: ${nombre} DNI: ${dni}. Estado actual: ${estado}`);
    
        // Enviar solicitud al backend para actualizar la cuota
        fetch(`http://127.0.0.1:8000/api/socios/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Asociado : !estado}) // Invierte el estado
        })
        .then(response => response.json())
        .then(data => {
            console.log('Estado cambiado:', data);
            fetchSocios(""); // Recargar la lista para actualizar la tabla
        })
        .catch(error => console.error('Error:', error));
    }; 
}
var asociado = "";
function soloSocios() {
    let parrafo = document.getElementById("solo-socios")
    let query = document.getElementById("buscar-personas").value.trim();
    if (query.length < 1) {
        query = "";
    }
    if (!parrafo.dataset.valor) {
        parrafo.textContent = "Solo Socios";
        parrafo.style.color = "green";
        asociado = "true"
        parrafo.dataset.valor = "true";
        fetchSocios(query, asociado)
    } else if (parrafo.dataset.valor == "true") {
        parrafo.textContent = "Solo No Socios";
        parrafo.style.color = "red";
        asociado = "false";
        parrafo.dataset.valor = "false";
        fetchSocios(query, asociado)
    } else {
        parrafo.textContent = "Socios y No Socios";
        parrafo.style.color = "lightblue";
        asociado = "";
        parrafo.dataset.valor = "";
        fetchSocios(query, asociado)
    }
}
let timeout = null;

function buscarPersonas() {
    let query = document.getElementById("buscar-personas").value.trim();

    clearTimeout(timeout);
    if (query.length < 1) {
        fetchSocios("", asociado)
        return;
    }

    timeout = setTimeout(() => {
        fetchSocios(query, asociado)
    });
};


// Función para eliminar un socio
function deleteSocio(id) {
    fetch(`http://127.0.0.1:8000/api/socios/${id}/`, {  // Asegúrate de que la URL está dentro de comillas invertidas
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Socio eliminado');
            fetchSocios(""); // Actualizar la lista después de eliminar
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
            document.getElementById("Asociado").value = data.Asociado;

            document.getElementById("cancelar").style.display = "inline";
            document.getElementById("enviar").textContent = "Actualizar Persona";

            let hiddenInput = document.getElementById("id-socio");
            if (!hiddenInput) {
                hiddenInput = document.createElement('input');
                hiddenInput.type = "hidden";
                hiddenInput.id = "id-socio";
                hiddenInput.name = "id";
                hiddenInput.value = id;
                form.appendChild(hiddenInput)
            } else {
                hiddenInput.value = id;
            }
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
    if (enviarBtn) enviarBtn.textContent = "Agregar Persona";
}

// Obtener los socios al cargar la página
document.addEventListener('DOMContentLoaded', fetchSocios(''));
{    
}

