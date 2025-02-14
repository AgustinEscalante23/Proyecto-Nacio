document.addEventListener('DOMContentLoaded', () => {
    const fetchAndPopulate = async (url, elementId, key) => {
        try {
            let objetos = [];
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar ${key}`);
            const data = await response.json();
            const select = document.getElementById(elementId);
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nombre;
                select.appendChild(option);
                objetos.push([item.id, item.nombre])
            });
            return(objetos)
        } catch (error) {
            console.error(`Error al cargar ${key}:`, error);
        }
    };

    const obtenerCategoriasEstados = async (url, key) => {
        try {
            let objetos = [];
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al obtener ${key}.`);
            const data = await response.json();
            data.forEach(item => {
                objetos.push([item.id, item.nombre])
            });
            return objetos;
        } catch (error) {
            console.error(`Error al obtener ${key}:`, error);
        }
    };
    
    const fetchProductos = async () => {
        try {
            let estados = await obtenerCategoriasEstados('/api_stock/estado/', 'estados');
            let categorias = await obtenerCategoriasEstados('/api_stock/categoria/', 'categorias');
            const response = await fetch('/api_stock/producto/');
            if (!response.ok) throw new Error('Error al cargar los productos');
            const data = await response.json();
            const stockList = document.getElementById('product-tbody');
            stockList.innerHTML = data.length ? data.map(producto => {
                 // Buscar el estado correspondiente
                let estadoNombre = "Sin estado";
                for (let estado of estados) {
                    if (estado[0] == producto.estado) {
                        estadoNombre = estado[1];
                        break;
                    }
                }

                // Buscar la categoría correspondiente
                let categoriaNombre = "Sin categoría";
                for (let categoria of categorias) {
                    if (categoria[0] == producto.categoria) {
                        categoriaNombre = categoria[1];
                        break;
                    }
                }
               return `
                <tr>
                    <td>${producto.nombre || 'Sin nombre'}</td>
                    <td>${estadoNombre}</td>
                    <td>${producto.codigo || 'Sin código'}</td>
                    <td>${categoriaNombre}</td>
                    <td>${producto.descripcion || 'Sin descripción'}</td>
                    <td>
                        <button class="delete-btn" data-id="${producto.codigo}">Eliminar</button>
                        <button class="edit-btn" data-id="${producto.codigo}" data-nombre="${producto.nombre}" data-estado="${producto.estado}" data-categoria="${producto.categoria}" data-descripcion="${producto.descripcion}">Editar</button>
                    </td>
                </tr>`}).join('') : '<tr><td colspan="6">No hay productos disponibles.</td></tr>';
            addEventListeners();
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al cargar los productos.');
        }
    };

    const addEventListeners = () => {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => deleteProducto(button.getAttribute('data-id')));
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => editProducto(
                button.getAttribute('data-id'),
                button.getAttribute('data-nombre'),
                button.getAttribute('data-estado'),
                button.getAttribute('data-categoria'),
                button.getAttribute('data-descripcion')
            ));
        });
    };

    window.deleteProducto = async (id) => {
        if (!id) return alert('El ID del producto no está definido');
        try {
            const response = await fetch(`/api_stock/producto/${id}/`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Error al eliminar el producto: ${await response.text()}`);
            console.log('Producto eliminado');
            fetchProductos();
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al eliminar el producto.');
        }
    };

    const editProducto = (id, nombre, estado, categoria, descripcion) => {
        document.getElementById('nombre').value = nombre;
        document.getElementById('estado').value = estado;
        document.getElementById('categoria').value = categoria;
        document.getElementById('descripcion').value = descripcion;

        document.getElementById('submit-btn').textContent = "Actualizar datos";

        document.getElementById('cancel-btn').style.display = 'inline';

        let productoIdInput = document.getElementById('producto-id');
        if (!productoIdInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.id = 'producto-id';
            hiddenInput.value = id;
            document.getElementById('stock-form').appendChild(hiddenInput);
        } else {
            productoIdInput.value = id; 
        }

    };


    document.getElementById('stock-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('producto-id')?.value;
        const nombre = document.getElementById('nombre').value;
        const estado = document.getElementById('estado').value;
        const categoria = document.getElementById('categoria').value;
        const descripcion = document.getElementById('descripcion').value;
        let url = "/api_stock/producto/"
        let method = 'POST'

        // Modificación aquí: quitar descripcion de la validación
        if (!nombre || !estado || !categoria) {
            return alert('Por favor, completa todos los campos obligatorios.');
        }

        if (id) {
            url += `${id}/`;
            method = 'PUT'
        }
        const requestBody = { nombre, estado: parseInt(estado), categoria: parseInt(categoria), descripcion};
        console.log('Request Body:', requestBody);
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
    
            if (!response.ok) throw new Error((await response.json()).detail || 'Error desconocido');
            console.log('Producto creado:', await response.json());
            resetForm();
            fetchProductos();
        } catch (error) {
            console.error('Error:', error.message);
            alert(`Ocurrió un error: ${error.message}`);
        };
    
    });

    fetchAndPopulate('/api_stock/estado/', 'estado', 'estados');
    fetchAndPopulate('/api_stock/categoria/', 'categoria', 'categorías');
    fetchProductos()
    console.log('DOM completamente cargado y analizado');
});

function resetForm() {
    const form = document.getElementById('stock-form');
    const hiddenInput = document.getElementById('producto-id');
    const cancelarBtn = document.getElementById('cancel-btn');
    const enviarBtn = document.getElementById('submit-btn');
    
    if (form) form.reset();
    if (hiddenInput) hiddenInput.remove();
    if (cancelarBtn) cancelarBtn.style.display = "none";
    if (enviarBtn) enviarBtn.textContent = "Agregar Inventario";
    
};
