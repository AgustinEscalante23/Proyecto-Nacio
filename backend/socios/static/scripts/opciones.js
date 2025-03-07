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
        alert("Cuotas cargadas.")
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

function backup(){
    fetch("http://127.0.0.1:8000/backup/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.mensaje)
    })
    .catch(error => {
        console.error("Error:", error);
    });
}