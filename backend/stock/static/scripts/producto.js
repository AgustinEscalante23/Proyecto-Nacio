document.addEventListener('DOMContentLoaded', () => {
    const fetchAndPopulate = async (url, elementId, key) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al cargar ${key}`);
            const data = await response.json();
            const select = document.getElementById(elementId);
            data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.nombre;
                    select.appendChild(option);
            });
        } catch (error) {
            console.error(`Error al cargar ${key}:`, error);
        }
    };

    const crearTablas = async () => {
        try {
            const response = await fetch('/api_stock/categoria/');
            const data = await response.json();
            const estadosResponse = await fetch('/api_stock/estado/');
            const estadosData = await estadosResponse.json();
            const tablasContainer = document.getElementById("tablas-container");
            tablasContainer.innerHTML = '';
    
            for (const categoria of data) {  // 🔹 Cambiado forEach() por for...of
                const total = await obtenerCantidad("", categoria.id);
                const prestados = await obtenerCantidad("", categoria.id, true);
    
                const div = document.createElement("div"); // 🔹 Se corrigió el error aquí
                div.id = `categoria${categoria.id}-container`;
                div.className = "contenedor";
                div.innerHTML = `
                    <div class="encabezado"> <div>${categoria.nombre}</div>  <div>Total: ${total}</div> </div>
                    <ul id="estados${categoria.id}" class="lista-estados">
                        <li id="prestado${categoria.id}" onclick="filtroPrestado('prestado${categoria.id}', 'buscar-productos${categoria.id}', 'tabla${categoria.id}')">
                            Prestados: ${prestados}
                        </li>
                    </ul>
                    <div class="boton" onclick="toggleTabla('tabla-contenedor${categoria.id}', 'triangulo${categoria.id}')">
                        <span id="triangulo${categoria.id}" class="triangulo">▶</span>
                    </div>
                    <div class="tabla-contenedor" id="tabla-contenedor${categoria.id}">
                        <label for="buscar-productos${categoria.id}">Buscar producto:</label>
                        <input type="text" id="buscar-productos${categoria.id}" data-categoria="${categoria.id}" data-estado="" data-prestado=""
                            placeholder="Buscar por nombre o código..." class="filtro">
                        <br>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Código</th>
                                    <th>Estado</th>
                                    <th>Descripción</th>
                                    <th>Está Prestado?</th>
                                </tr>
                            </thead>
                            <tbody id="tabla${categoria.id}"></tbody>
                        </table>
                    </div>
                `;
    
                const estadosList = div.querySelector(`#estados${categoria.id}`); // 🔹 Se obtiene el `ul` correctamente
    
                for (const estado of estadosData) {  // 🔹 Cambiado forEach() por for...of
                    let cantidad = await obtenerCantidad(estado.id, categoria.id, false);
                    const li = document.createElement("li");
                    li.id = `estado${estado.id}${categoria.id}`;
                    li.textContent = `${estado.nombre}: ${cantidad}`;
                    li.onclick = function () {
                        filtroEstado(`estado${estado.id}${categoria.id}`, `buscar-productos${categoria.id}`, estado.id, `tabla${categoria.id}`);
                    };
                    estadosList.appendChild(li);
                }
    
                tablasContainer.appendChild(div);
                fetchProductos(`tabla${categoria.id}`, '', '', categoria.id, '');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    async function obtenerCantidad(estado, categoria, prestado) {
        try {
            response = await fetch(`/api_stock/producto/?estado=${estado}&categoria=${categoria}&prestado=${prestado}&count=true`);
            data = await response.json();
            return data.cantidad
        } catch (error){
            console.error('Error:', error)
        }

    }

    const detalleProducto = (producto) => {

    }

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
            method = 'PATCH'
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
    crearTablas();
    console.log('DOM completamente cargado y analizado');
});

const fetchProductos = async (idTabla, q, estado, categoria, prestado) => {
    try {
        const response = await fetch(`/api_stock/producto/?q=${q}&estado=${estado}&categoria=${categoria}&prestado=${prestado}`);
        if (!response.ok) throw new Error('Error al cargar los productos');
        const data = await response.json();
        const tablaBody = document.getElementById(idTabla);
        if (data.length) {
            tablaBody.innerHTML = data.map(producto => {
                return `
                 <tr onclick="detalleProducto(producto)">
                     <td>${producto.nombre || 'Sin nombre'}</td>
                     <td>${producto.codigo || 'Sin código'}</td>
                     <td>${producto.estado.nombre || 'Sin estado'}</td>
                     <td>${producto.descripcion || 'Sin descripción'}</td>
                     <td>${producto.prestado? "SI" : "NO" }</td>
                 </tr>`}).join('')
        } else {
            '<tr><td colspan="4">No hay productos disponibles.</td></tr>';
        }
    
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al cargar los productos.');
    }
};

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

function toggleTabla(idTabla, idTriangulo) {
    let tabla = document.getElementById(idTabla);
    let triangulo = document.getElementById(idTriangulo);
    
    if (tabla.classList.contains("mostrar")) {
        tabla.classList.remove("mostrar");
        triangulo.style.transform = "rotate(0deg)"; // Flecha hacia la derecha
    } else {
        tabla.classList.add("mostrar");
        triangulo.style.transform = "rotate(90deg)"; // Flecha hacia abajo
    }
}

async function filtroPrestado(idPrestado, idFiltro, idTabla) {
    const liPrestado = document.getElementById(idPrestado);
    const filtro = document.getElementById(idFiltro);
    const estadoFiltro = parseInt(filtro.getAttribute('data-estado'));
    const categoriaFiltro = parseInt(filtro.getAttribute('data-categoria'));
    const query = filtro.value;
    const liEstadoAnterior = document.getElementById(`estado${estadoFiltro}${categoriaFiltro}`);
    if (filtro.dataset.prestado != "true") {
        if (liEstadoAnterior) {
            liEstadoAnterior.style.backgroundColor = "white";
        }
        liPrestado.style.backgroundColor = "#f0f0f0";
        filtro.dataset.prestado = "true";
        filtro.dataset.estado = "";
        fetchProductos(idTabla, query, "", categoriaFiltro, true)
    } else {
        liPrestado.style.backgroundColor = "white";
        filtro.dataset.prestado = "";
        fetchProductos(idTabla, query, "", categoriaFiltro, "")
    }

}

async function filtroEstado(idLiEstado, idFiltro, idEstado, idTabla) {
    const liEstadoActual = document.getElementById(idLiEstado);
    const filtro = document.getElementById(idFiltro);
    const estadoFiltro = parseInt(filtro.getAttribute('data-estado'));
    const categoriaFiltro = parseInt(filtro.getAttribute('data-categoria'));
    const query = filtro.value;
    const liEstadoAnterior = document.getElementById(`estado${estadoFiltro}${categoriaFiltro}`);

    if (liEstadoActual != liEstadoAnterior) {
        if (liEstadoAnterior) {
            liEstadoAnterior.style.backgroundColor = "white";
        };
        liEstadoActual.style.backgroundColor = "#f0f0f0";
        filtro.dataset.estado = `${idEstado}`;
        filtro.dataset.prestado = "false";
        fetchProductos(idTabla, query, idEstado, categoriaFiltro)
    } else {
        liEstadoActual.style.backgroundColor = "white";
        filtro.dataset.estado = '';
        fetchProductos(idTabla, query, "", categoriaFiltro)
    }

}