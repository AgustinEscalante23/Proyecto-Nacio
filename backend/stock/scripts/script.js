
function crearProducto(endpoint, producto) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(producto),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      console.log('Producto creado:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Uso de la función
const nuevoproducto = { titulo: 'Nuevo Producto', descripcion: 'Descripción del producto' };
crearProducto('/api_stock/', nuevoproducto);

const nuevoestado = { titulo: 'Nuevo Estado', descripcion: 'Descripción del estado' };
crearProducto('/api_stock/', nuevoestado);

const nuevacategoria = { titulo: 'Nueva Categoria', descripcion: 'Descripción de la categoria' };
crearProducto('/api_stock/', nuevacategoria);