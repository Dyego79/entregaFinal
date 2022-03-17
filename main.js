const d = document;
const container = d.querySelector("#productos");
const botonMostrarCarrito = d.querySelector("#mostrarCarrito");
const productos = d.querySelector("#carrito");

class Servicios {
    constructor(codigo, nombre, precio) {
        this.codigo = codigo;
        this.nombre = nombre.toUpperCase();
        this.precio = parseFloat(precio);
    }
    imprimirServicios() {
        container.innerHTML += `
        <div class="claseFlex">
            <div>${this.codigo}</div>
            <div>${this.nombre}</div>
            <div>$ ${this.precio},-</div>
            <div><button class="btn btn-primary btn-md  botonMostrar" id="${this.codigo}" >Quiero!</button></div>
        </div>`
    }
}

const imprimir = (servicios) => {
    servicios.forEach((servicio) => {
        servicio.imprimirServicios();
    });
    agregarEventos();
};


const carrito = [];
const sumatoriaCarrito = [];
const arrayServicios = [];


const dataJsonAsync = async() => {
    let data = await (await fetch("database/servicios.json")).json();
    data.forEach(element => {
        arrayServicios.push(new Servicios(element.codigo, element.nombre, element.precio));
    });
    imprimir(arrayServicios);
}

dataJsonAsync();

/*FUNCION PARA AGREGAR CADA SERVICIO AL ARRAY CARRITO*/

const agregarEventos = () => {
    let botones = Array.from(document.getElementsByClassName("botonMostrar"));
    botones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            let idClickeado = e.target.id;
            boton.disabled = true;
            let servicioClickeado = arrayServicios.find(servicio => servicio.codigo == idClickeado);
            carrito.push(servicioClickeado);
            let div = d.createElement('div');
            div.className = "divsCarrito d-flex justify-content-between animate__animated animate__backInDown dives";
            let divNombre = d.createElement('div');
            divNombre.innerHTML = `${servicioClickeado.nombre}:`;
            div.appendChild(divNombre);
            let divPrecio = d.createElement('div');
            divPrecio.innerHTML = `$ ${servicioClickeado.precio}`;
            div.appendChild(divPrecio)
            productos.appendChild(div);
            sumatoriaCarrito.push(servicioClickeado.precio);
        })
    });
}

const borrarCarrito = d.querySelector("#borrar").addEventListener("click", () => {
    let resets = Array.from(document.getElementsByClassName("botonMostrar"));
    resets.forEach(r => {
        r.addEventListener("click", (e) => { let rclick = e.target.id; })
        r.disabled = false;
    });
    (carrito.length === 0) ? Swal.fire({ icon: 'error', title: 'Oops...', text: 'No hay nada que vaciar!', }): Swal.fire('Vaciaste el Carrito');

    const divItemCarrito = d.querySelectorAll(".dives");

    for (const item of divItemCarrito) {
        divItemCarrito.className = "divsCarrito d-flex justify-content-between animate__animated animate__backOutDown divesOut";
        productos.firstChild.remove();
    }
    carrito.length = 0;
    sumatoriaCarrito.length = 0;
});

const comprar = d.querySelector("#comprar").addEventListener("click", () => {
    const sumaCarrito = [...sumatoriaCarrito].reduce((prev, curr) => prev + curr, 0);
    let { length } = carrito;
    ///////////////////guardar en localStorage//////////////////////////////
    const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };
    guardarLocal("servicios", JSON.stringify(carrito));
    ////////////////////////////////////////////////////////////////////////
    (carrito.length === 0) ? Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor. Elije un servicio!',
        }):
        Swal.fire(
            `Compraste ${length} Servicios.<h3> Importe Total: $${sumaCarrito} </h3>`,
            'Recibimos tu pedido con Éxito!',
            'success'
        )

    carrito.length = 0;
    sumatoriaCarrito.length = 0;

    productos.innerHTML = ``;
    let resets = Array.from(document.getElementsByClassName("botonMostrar"));
    resets.forEach(r => {
        r.addEventListener("click", (e) => {})
        r.disabled = false;
    });
});

const recuperar = d.querySelector("#recuperar").addEventListener("click", () => {
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
    }
    const localServicios = localStorage.getItem('servicios');
    localServiciosParse = JSON.parse(localServicios);
    for (const objeto of localServiciosParse) {
        carrito.push(objeto);
        let div = d.createElement('div');
        div.className = "divsCarrito d-flex justify-content-between animate__animated animate__backInDown dives";
        let divNombre = d.createElement('div');
        divNombre.innerHTML = `${objeto.nombre}:`;
        div.appendChild(divNombre);
        let divPrecio = d.createElement('div');
        divPrecio.innerHTML = `$ ${objeto.precio}`;
        div.appendChild(divPrecio)
        productos.appendChild(div);
    }
});