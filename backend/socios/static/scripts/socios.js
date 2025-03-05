document.getElementById("socios-form").addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('id-socio')?.value;
    const formData = new FormData(event.target);
    formData.append("Asociado", "true");
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
        fetchSocios("", completas); // Actualizar la lista de socios después de agregar
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Función para obtener y mostrar los socios
function fetchSocios(query, completas) {
    fetch(`http://127.0.0.1:8000/api/cuotas/?q=${query}&completas=${completas}`)
        .then(response => response.json())
        .then(data => {
            const sociosList = document.getElementById('socio-list-body');
            sociosList.innerHTML = ''; // Limpiar la lista existente
            data.forEach(cuotas => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${cuotas.socio.Nombre_Completo}</td>
                    <td>${cuotas.socio.Documento}</td>
                    <td>${cuotas.socio.Telefono}</td>
                    <td>${cuotas.socio.Domicilio}</td>
                    <td>${cuotas.anio}</td>
                    ${renderCuota(cuotas.cuota1, cuotas.id, 1, cuotas.socio.Nombre_Completo)}
                    ${renderCuota(cuotas.cuota2, cuotas.id, 2, cuotas.socio.Nombre_Completo)}
                    ${renderCuota(cuotas.cuota3, cuotas.id, 3, cuotas.socio.Nombre_Completo)}
                    ${renderCuota(cuotas.cuota4, cuotas.id, 4, cuotas.socio.Nombre_Completo)}
                    ${renderCuota(cuotas.cuota5, cuotas.id, 5, cuotas.socio.Nombre_Completo)}
                    ${renderCuota(cuotas.cuota6, cuotas.id, 6, cuotas.socio.Nombre_Completo)}
                `;
                sociosList.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función auxiliar para mostrar "PAGA" o "IMPAGA"
function renderCuota(estado, id, cuotaNumero, nombreSocio) {
    return `
        <td onclick="cambiarEstadoCuota(${estado}, ${id}, ${cuotaNumero}, '${nombreSocio}')"
        style="color: ${estado ? 'green' : 'red'}; font-weight: bold; cursor: pointer;">
            ${estado ? 'PAGA ✅' : 'IMPAGA ❌'}
        </td>
    `;
}

// Función para cambiar el estado de la cuota
function cambiarEstadoCuota(estado, id, cuotaNumero, nombreSocio) {
    if (confirm(`¿Desea Cambiar el estado de la Cuota N°${cuotaNumero} del socio ${nombreSocio} a ${!estado ? 'PAGA ✅' : 'IMPAGA ❌'}?`)) {
        
        console.log(`Cambiando estado de Cuota ${cuotaNumero} para coutas ID ${id}. Estado actual: ${estado}`);

        // Construir dinámicamente el objeto con la cuota correcta
        let cuotaKey = `cuota${cuotaNumero}`;
        let data = {};
        data[cuotaKey] = !estado; // Invertir el estado
    
        // Enviar solicitud al backend para actualizar la cuota
        fetch(`http://127.0.0.1:8000/api/cuotas/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data) // Invierte el estado
        })
        .then(response => response.json())
        .then(data => {
            console.log('Estado cambiado:', data);
            fetchSocios("", completas); // Recargar la lista para actualizar la tabla
        })
        .catch(error => console.error('Error:', error));
    }; 
}

var completas = "false";
function visualizar() {
    let parrafo = document.getElementById("visualizar")
    let query = document.getElementById("filtrar-cuotas").value.trim();
    if (query.length < 1) {
        query = "";
    }
    if (!parrafo.dataset.valor) {
        parrafo.textContent = "Años Pagos";
        parrafo.style.color = "green";
        completas = "true"
        parrafo.dataset.valor = "true";
        fetchSocios(query, completas)
    } else if (parrafo.dataset.valor == "true") {
        parrafo.textContent = "Años Impagos";
        parrafo.style.color = "red";
        completas = "false";
        parrafo.dataset.valor = "false";
        fetchSocios(query, completas)
    } else {
        parrafo.textContent = "Años Pagos e Impagos";
        parrafo.style.color = "lightblue";
        completas = "";
        parrafo.dataset.valor = "";
        fetchSocios(query, completas)
    }
}

// filtrar por socio

let timeoutfiltrar = null;

function filtrar() {
    let query = document.getElementById("filtrar-cuotas").value.trim();

    clearTimeout(timeoutfiltrar);
    if (query.length < 1) {
        fetchSocios("", completas)
        return;
    }

    timeoutfiltrar = setTimeout(() => {
        fetchSocios(query, completas)
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

function cargarCuotas(){
    fetch("http://127.0.0.1:8000/api/verificar-cuotas/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.mensaje)
        fetchSocios("", completas)
        alert("Cuotas cargadas.")
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
// Obtener los socios al cargar la página
document.addEventListener('DOMContentLoaded', fetchSocios("", completas));
{    
}
