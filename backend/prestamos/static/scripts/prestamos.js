
var modals = document.querySelectorAll(".modal"); // Todos los modales
var productosPrestamosEditados = [];

window.onclick = function(event) {
    modals.forEach(function(modal) {
        if (event.target == modal) {
            modal.style.display = "none"; // Cerrar el modal
            resetForm();
        }
    });
};

function abrir(id) {
    let modal = document.getElementById(id);
    modal.style.display = "block";
};

function cerrar(id) {
    let modal = document.getElementById(id);
    modal.style.display = "none";
};

//Buscar socios
let timeoutSocios = null;

function buscarSocio() {
    let query = document.getElementById("buscar-socio").value.trim();

    clearTimeout(timeoutSocios);
    if (query.length < 1) {
        document.getElementById("listaSocios").innerHTML = "";
        return;
    }

    timeoutSocios = setTimeout(() => {
        fetch(`http://localhost:8000/api/buscar-socios/?q=${query}`)
        .then(response => response.json())
        .then(data => {
            let lista = document.getElementById("listaSocios");
            lista.innerHTML = ""; // Limpiar resultados previos

            if (data.length === 0) {
                lista.innerHTML = "<li>No se encontraron los datos de la persona.</li>";
                return;
            }

            data.forEach(socio => {
                let item = document.createElement("li");
                item.textContent = `${socio.Nombre_Completo} - ${socio.Documento}`;
                item.onclick = function() { seleccionarSocio(socio); };
                lista.appendChild(item);
            });
        })
        .catch(error => console.error("Error en la búsqueda:", error));
    }, 300);
}

function seleccionarSocio(socio) {
    document.getElementById("prestatario").value = socio.id;
    document.getElementById("buscar-socio").value = `${socio.Nombre_Completo} - ${socio.Documento}`;
    document.getElementById("listaSocios").innerHTML = "";
}

// buscar productos

let timeoutProductos = null;

function buscarProductos() {
    let query = document.getElementById("buscar-productos").value.trim();

    clearTimeout(timeoutProductos);
    if (query.length < 1) {
        document.getElementById("listaProductos").innerHTML = "";
        return;
    }

    timeoutProductos = setTimeout(() => {
        fetch(`http://localhost:8000/api_stock/buscar-productos/?q=${query}`)
        .then(response => response.json())
        .then(data => {
            let lista = document.getElementById("listaProductos");
            lista.innerHTML = ""; // Limpiar resultados previos

            if (data.length === 0) {
                lista.innerHTML = "<li>No se encontraron productos.</li>";
                return;
            }

            data.forEach(producto => {
                let item = document.createElement("li");
                item.innerHTML = `
                ${producto.nombre} <br>
                Código: ${producto.codigo} <br>
                Estado: ${producto.estado.nombre} <br>
                Descripción: ${producto.descripcion}`;
                item.onclick = function() { seleccionarProducto(producto); };
                lista.appendChild(item);
            });
        })
        .catch(error => console.error("Error en la búsqueda:", error));
    }, 300);
}

function seleccionarProducto(producto) {
    document.getElementById("buscar-productos").value = "";
    document.getElementById("listaProductos").innerHTML = "";

    const productosSeleccionados = document.getElementById('listaProductosSeleccionados');
    const listItems = document.querySelectorAll('#listaProductosSeleccionados li');
    let verificador = false;
    listItems.forEach(item => {
       let valor = item.getAttribute('data-id');
       valor = parseInt(valor)
       if (valor == producto.id) {
        verificador = true;
       }
    });
    
    if (verificador == false) {
        let item = document.createElement("li");
        let button = document.createElement("button");

        item.id = `producto${producto.id}`;
        item.textContent = `${producto.nombre} - Código: ${producto.codigo}`;
        item.setAttribute('data-id', `${producto.id}`);

        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.gap = "5px";

        button.type = "button";
        button.textContent = "Eliminar";
        button.onclick = () => {
            producto = document.getElementById(item.id)
            if (producto) producto.remove()
        };

        item.appendChild(button)
        productosSeleccionados.appendChild(item)
    }
}

async function obtenerProductos() {
    let productos = [];
    const listItems = document.querySelectorAll('#listaProductosSeleccionados li');
    listItems.forEach(item => {
        let id = item.getAttribute('data-id');
        id = parseInt(id)
        productos.push(id)
    })

    return productos
}

document.getElementById("prestamos-form").addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('id-prestamo')?.value;
    const prestatario = document.getElementById("prestatario").value;
    const productos = await obtenerProductos();
    const duracion = document.getElementById("duracion").value;
    const fecha_extraccion = document.getElementById("fecha_extraccion").value;
    let url = `http://127.0.0.1:8000/api/prestamos/`;
    let method = 'POST';

    if (!prestatario || !productos || !duracion) {
        return alert('Por favor, completa todos los campos obligatorios.');
    }
    
    const requestBody = {
        prestatario: parseInt(prestatario),
        productos: productos,
        duracion: parseInt(duracion),
        ...(fecha_extraccion ? { fecha_extraccion } : {}) // Solo agregar si tiene valor
    };

    if (id) {
       url += `${id}/`
       method = 'PUT'
    };

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Prestamo registrado:', data);
        productosPrestamosEditados = [];
        resetForm();
        buscarVencimientosProximos();
        fetchPrestamos("", false);
        fetch(`http://localhost:8000/api/prestamos/${data.id}/`)
        .then(r => r.json())
        .then(d => {
            detallePrestamo(d);
            for (let p of d.productos ) {
                cambiarEstadoProducto(p.id, true)
            };
        })

    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function editarPrestamo(prestamo) {
    console.log(prestamo)
    let modal = document.getElementById("formulario");
    seleccionarSocio(prestamo.prestatario);

    for (let producto of prestamo.productos) {
        seleccionarProducto(producto);
        cambiarEstadoProducto(producto.id, false);
        productosPrestamosEditados.push(producto.id)
    };

    document.getElementById("duracion").value = prestamo.duracion;
    document.getElementById("fecha_extraccion").value = prestamo.fecha_extraccion;
    document.getElementById("cancelar").style.display = "inline";
    document.getElementById("enviar").textContent = "Actualizar Prestamo";

    let hiddenInput = document.getElementById("id-prestamo");
    if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";
        hiddenInput.id = "id-prestamo";
        hiddenInput.name = "id";
        hiddenInput.value = prestamo.id;
        document.getElementById("prestamos-form").appendChild(hiddenInput)
    } else {
        hiddenInput.value = prestamo.id;
    }

    modal.style.display = "block";
};

function finalizarPrestamo(prestamo) {
    fetch(`http://localhost:8000/api/prestamos/${prestamo.id}/`, { 
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            finalizado: true
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Préstamo finalizado:', data);
        for (let p of prestamo.productos) {
            cambiarEstadoProducto(p.id, false)
        }
        location.reload();
    })
    .catch(error => console.error('Error:', error));
};

function borrarPrestamo(prestamo) {
    // Mostrar mensaje de confirmación
    if (confirm("¿Estás seguro de que quieres borrar este préstamo?")) {
        fetch(`http://localhost:8000/api/prestamos/${prestamo.id}/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert("Préstamo eliminado correctamente.");
                for (let p of prestamo.productos) {
                    cambiarEstadoProducto(p.id, false)
                }
                location.reload();  // Recargar la página después de borrar
            } else {
                alert("Error al eliminar el préstamo.");
            }
        })
        .catch(error => console.error("Error:", error));
    }
}
function resetForm() {
    const form = document.getElementById("prestamos-form");
    const modal = document.getElementById("formulario");
    const prestatario = document.getElementById("prestatario");
    const hiddenInput = document.getElementById('id-prestamo');
    const cancelarBtn = document.getElementById('cancelar');
    const enviarBtn = document.getElementById('enviar');

    document.getElementById("listaSocios").innerHTML = "";
    document.getElementById("listaProductos").innerHTML = "";
    document.getElementById("listaProductosSeleccionados").innerHTML = ""
    
    modal.style.display = "none";

    for (let id of productosPrestamosEditados){
        cambiarEstadoProducto(id, true)
    }

    productosPrestamosEditados = [];

    if (form) form.reset();
    if (prestatario) prestatario.value = "";
    if (hiddenInput) hiddenInput.remove();
    if (cancelarBtn) cancelarBtn.style.display = "none";
    if (enviarBtn) enviarBtn.textContent = "Registrar prestamo";
}

const fetchPrestamos = async (q, estado, fecha) => {
    try {
        const response = await fetch(`http://localhost:8000/api/prestamos/?q=${q}&estado=${estado}&fecha=${fecha}`);
        const data = await response.json();

        let lista = document.getElementById("lista-prestamos");
        lista.innerHTML = ""; // Limpiar resultados previos

        if (data.length === 0) {
            lista.innerHTML = "<li>No se encontraron préstamos.</li>";
            return;
        }

        for (const prestamo of data) {
            // Crear el elemento de la lista
            let item = document.createElement("li");
            item.innerHTML = `Préstamo N° ${prestamo.id} <br> 
                              ${prestamo.prestatario.Nombre_Completo} <br> 
                              ${prestamo.prestatario.Documento} <br> 
                              Fecha de Devolución: ${prestamo.fecha_devolucion}`;
            
            item.onclick = function() { detallePrestamo(prestamo); };
            lista.appendChild(item);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    buscarVencimientosProximos();
    fetchPrestamos("", false);
});

let timeoutPrestamos = null;
async function buscarPrestamos(){
    let query = document.getElementById("buscar-prestamos").value.trim();

    clearTimeout(timeoutPrestamos);
    if (query.length < 1) {
        await fetchPrestamos("", false, "")
        return;
    }

    timeoutPrestamos = setTimeout(() => {
        fetchPrestamos(query, false, "");
}, 300);
}

async function detallePrestamo (prestamo) {
    
    let detalleList = document.getElementById('lista-detalle');

    detalleList.innerHTML = "";
    detalleList.innerHTML = `
    <h3>Préstamo N° ${prestamo.id}</h3>
    <li>
    <h4>Prestatario:</h4>
    Nombre: ${prestamo.prestatario.Nombre_Completo} <br>
    DNI: ${prestamo.prestatario.Documento} <br>
    Teléfono: ${prestamo.prestatario.Telefono} <br>
    </li>
    <li>Fecha de Extracción: ${prestamo.fecha_extraccion}</li>
    <li>Fecha de Devolución: ${prestamo.fecha_devolucion}</li>
    <li><h4>Productos:</h4></li>
    <li><ul id="detalle-productos" class="detalle-productos" ></ul></li>
    `;
    
    let btnContainer = document.getElementById("button-container");
    btnContainer.innerHTML=`
        <button id="borrar" class="borrar-btn">Borrar</button>
        <button id="editar" class="editar-btn">Editar</button>
        <button id="finalizar" class="finalizar-btn">Finalizar Préstamo</button>
    `;

    const btnEditar = document.getElementById("editar");
    btnEditar.addEventListener("click", () => editarPrestamo(prestamo));

    const btnborrar = document.getElementById("borrar");
    btnborrar.addEventListener("click", () => borrarPrestamo(prestamo));

    const btnfinalizar = document.getElementById("finalizar");
    btnfinalizar.addEventListener("click", () => finalizarPrestamo(prestamo));
    

    let detalleProductos = document.getElementById("detalle-productos");

    for (const [index, producto] of prestamo.productos.entries()) {
        let li = document.createElement('li');
        li.innerHTML = `
        Producto ${index+1}: ${producto.nombre} <br>
        Código: ${producto.codigo}
        `;
        detalleProductos.appendChild(li);
    }

};

async function buscarVencimientosProximos() {
    try {
        const response = await fetch('http://localhost:8000/api/prestamos/?estado=false&fecha=vencimiento');
        const data = await response.json();

        let lista = document.getElementById("lista-vencimientos");
        lista.innerHTML = ""; // Limpiar resultados previos

        if (data.length === 0) {
            lista.innerHTML = "<li>No se encontraron préstamos próximos a vencer.</li>";
            return;
        }

        const fechaHoy = new Date();
        fechaHoy.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo fechas

        for (const prestamo of data) {
            const fechaDevolucion = new Date(prestamo.fecha_devolucion);
            fechaDevolucion.setHours(0, 0, 0, 0); // Eliminar la hora

            let mensaje = document.createElement('p');
            mensaje.style.fontWeight = "bold";

            if (fechaDevolucion < fechaHoy) {
                mensaje.innerText = "Vencido";
                mensaje.style.color = "red";
            } else if (fechaDevolucion.getTime() === fechaHoy.getTime()) {
                mensaje.innerText = "Vence hoy";
                mensaje.style.color = "orange";
            } else {
                mensaje.innerText = ""; // No mostrar nada si aún no vence
            }

            let item = document.createElement("li");
            item.innerHTML = `Préstamo N° ${prestamo.id} <br> 
                              ${prestamo.prestatario.Nombre_Completo} <br> 
                              ${prestamo.prestatario.Documento} <br> 
                              Fecha de Devolución: ${prestamo.fecha_devolucion}`;
            
            item.appendChild(mensaje); // Agregar el mensaje debajo del texto
            item.onclick = function() { detallePrestamo(prestamo); };
            lista.appendChild(item);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
}

async function fetchPrestamosFinalizados() {
    abrir('prestamos-finalizados');
    try {
        const response = await fetch('http://localhost:8000/api/prestamos/?estado=true');
        const data = await response.json();

        let lista = document.getElementById("lista-finalizados");
        lista.innerHTML = ""; // Limpiar resultados previos

        if (data.length === 0) {
            lista.innerHTML = "<li>No se encontraron préstamos finalizados.</li>";
            return;
        }

        for (const prestamo of data) {
           
            let item = document.createElement("li");
            item.innerHTML = `
                <h3>Préstamo N° ${prestamo.id}</h3>
                <strong>Prestatario:</strong><br>
                Nombre: ${prestamo.prestatario.Nombre_Completo} <br>
                DNI: ${prestamo.prestatario.Documento} <br>
                Teléfono: ${prestamo.prestatario.Telefono} <br>
                <strong>Fecha de Extracción:</strong> ${prestamo.fecha_extraccion} <br>
                <strong>Fecha de Devolución:</strong> ${prestamo.fecha_devolucion} <br>
                <strong>Productos:</strong><br>
                `;
            let ul = document.createElement('ul');
            ul.className = 'detalle-productos';
            for (const [index, producto] of prestamo.productos.entries()) {
                let li = document.createElement('li');
                li.innerHTML = `
                Producto ${index+1}: ${producto.nombre} <br>
                Código: ${producto.codigo}
                `;
                ul.appendChild(li);
            };
            item.appendChild(ul)
            lista.appendChild(item);
        }
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
}

async function cambiarEstadoProducto(id, estado) {
        fetch(`http://localhost:8000/api_stock/producto/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prestado: estado }) // Enviar solo el campo a actualizar
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar el producto");
            }
            return response.json();
        })
        .then(data => {
            console.log("Producto actualizado:", data);
            console.log("Estado de producto actualizado correctamente.");
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
