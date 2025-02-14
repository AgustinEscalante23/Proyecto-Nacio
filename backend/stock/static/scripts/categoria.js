document.getElementById('category-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;

    // Crear nuevo Categoria
    fetch('/api_stock/categoria/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: nombre }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Categoria creada:', data);
        fetchCategoria(); // Actualizar la lista de Categorias después de agregar
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Función para obtener y mostrar los Categorias
function fetchCategoria() {
    fetch('/api_stock/categoria/')
        .then(response => response.json())
        .then(data => {
            const stockList = document.getElementById('category-list').getElementsByTagName('tbody')[0];
            stockList.innerHTML = ''; // Limpiar la lista existente
            data.forEach(Categoria => {
                const CategoriaRow = document.createElement('tr');
                CategoriaRow.innerHTML = `
                    <td>${Categoria.nombre}</td>
                    <td>
                        <button onclick="deleteCategoria(${Categoria.id})">Eliminar</button>
                        <button onclick="editCategoria(${Categoria.id}, '${Categoria.nombre}')">Editar</button>
                    </td>
                `;
                stockList.appendChild(CategoriaRow);
            });
        })
        .catch(error => console.error('Error:', error));
}

// Función para eliminar un Categoria
function deleteCategoria(id) {
    fetch(`/api_stock/categoria/${id}/`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Categoria eliminado');
            fetchCategoria(); // Actualizar la lista después de eliminar
        } else {
            console.error('Error al eliminar:', response.categoryText);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Función para editar un Categoria
function editCategoria(id, nombre) {
    const nuevoNombre = prompt("Edita el nombre del Categoria:", nombre);
    if (nuevoNombre) {
        fetch(`/api_stock/categoria/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: nuevoNombre }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Categoria actualizado:', data);
            fetchCategoria(); // Actualizar la lista después de editar
        })
        .catch(error => console.error('Error:', error));
    }
}

// Obtener los Categoria al cargar la página
fetchCategoria();