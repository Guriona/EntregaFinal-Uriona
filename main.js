const carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
let precioTotal = 0;

function agregarProducto(nombre, precio) {
    const productoElegido = carrito.find(item => item.nombre === nombre);

    if (productoElegido) {
        productoElegido.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    
    precioTotal += precio;
    guardarCarritoStorage();
    actualizarPrecio();
}

function actualizarPrecio() {
    const precioFinal = document.getElementById("precioFinal");
    precioFinal.textContent = `Total: $${precioTotal}`;
}

function guardarCarritoStorage() {
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarProductos() {
    fetch("productos.json")
        .then(response => response.json())
        .then(data => {
            mostrarProductos(data);
        })
        .catch(error => {
            console.error(`Error al cargar los productos:`, error);
        });
}

function mostrarProductos(productos) {
    const listaProductos = document.getElementById("listaProductos");

    productos.forEach(producto => {
        const productoElement = document.createElement("li");
        productoElement.textContent = `${producto.nombre} - $${producto.precio}`;
        const botonAgregar = document.createElement("button");
        botonAgregar.textContent = "Agregar producto";
        botonAgregar.addEventListener("click", () => {
            agregarProducto(producto.nombre, producto.precio);
        });
        productoElement.appendChild(botonAgregar);
        listaProductos.appendChild(productoElement);
    });
}

function compraFinal() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El carrito está vacío!',
            footer: '<a href="">¿Quiere realizar una compra?</a>'
        });
    } else {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Su compra fue realizada con éxito!',
            showConfirmButton: false,
            timer: 1500
        });

        resetearProductos();
    }
}

function resetearProductos() {
    carrito.length = 0;
    precioTotal = 0;

    guardarCarritoStorage();
    actualizarPrecio();
}

document.getElementById("btn__compraFinal").addEventListener("click", () => {
    compraFinal();
});

cargarProductos();
