document.getElementById('status-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;

    // Crear nuevo estado
    fetch('/api_stock/estado/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombre }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Estado creado:', data);
        fetchEstados(); // Actualizar la lista de estados después de agregar
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Función para obtener y mostrar los estados
function fetchEstados() {
    fetch('/api_stock/estado/')
        .then(response => response.json())
        .then(data => {
            const stockList = document.getElementById('status-list').getElementsByTagName('tbody')[0];
            stockList.innerHTML = ''; // Limpiar la lista existente
            data.forEach(estado => {
                const estadoRow = document.createElement('tr');
                estadoRow.innerHTML = `
                    <td>${estado.nombre}</td>
                    <td>
                        <button onclick="deleteEstado(${estado.id})">Eliminar</button>
                        <button onclick="editEstado(${estado.id}, '${estado.nombre}')">Editar</button>
                    </td>
                `;
                stockList.appendChild(estadoRow);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar un estado
function deleteEstado(id) {
    fetch(`/api_stock/estado/${id}/`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Estado eliminado');
            fetchEstados(); // Actualizar la lista después de eliminar
        } else {
            console.error('Error al eliminar:', response.statusText);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para editar un estado
function editEstado(id, nombre) {
    const nuevoNombre = prompt("Edita el nombre del estado:", nombre);
    if (nuevoNombre) {
        fetch(`/api_stock/estado/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Estado actualizado:', data);
            fetchEstados(); // Actualizar la lista después de editar
        })
        .catch(error => console.error('Error:', error));
    }
}

// Obtener los estados al cargar la página
fetchEstados();