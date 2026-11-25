// ---------- Archivo principal (eventos) ----------
// Es el único archivo que cargan las páginas HTML (<script type="module">).
// Responsabilidad: referencias al DOM, escuchadores de eventos e inicio de cada vista.
// La lógica está separada en módulos: datos, filtros, carrito, validaciones, formularios, servicios/email y renderizado.

// Importaciones
import { obtenerProductos, leerCarrito, guardarCarrito, vaciarCarrito } from './datos.js';
import { filtrarProductos, ordenarProductos, obtenerProductoPorId } from './filtros.js';
import {
    CANTIDAD_MAXIMA, agregarAlCarrito, cambiarCantidad, quitarDelCarrito, contarUnidades,
    calcularSubtotal, calcularEnvio, generarNumeroPedido, armarDetallePedido
} from './carrito.js';
import { validarContacto, validarCantidad, validarPedido } from './validaciones.js';
import { construirCliente, construirJSONContacto } from './formularios.js';
import { enviarConsulta, enviarPedido } from './servicios/email.js';
import {
    renderizarProductos, renderizarDetalle, renderizarOfertas, renderizarCarrito, renderizarResumen,
    renderizarConfirmacion, tiposMensaje, mostrarMensaje, actualizarContador
} from './renderizado.js';

// ---------- Referencias DOM ----------
const contadorCarrito = document.getElementById("contador-carrito");
const contenedorDestacados = document.getElementById("contenedor-destacados");
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorDetalle = document.getElementById("contenedor-detalle");
const contenedorOfertas = document.getElementById("contenedor-ofertas");
const contenedorCarrito = document.getElementById("contenedor-carrito");
const formularioContacto = document.getElementById("formulario-contacto");

// ---------- Funciones compartidas ----------

// Agrega un producto al carrito, lo guarda en localStorage y actualiza el contador
const agregarProducto = (producto, cantidad) => {
    const carritoActualizado = agregarAlCarrito(leerCarrito(), producto, cantidad);
    guardarCarrito(carritoActualizado);
    actualizarContador(contadorCarrito, contarUnidades(carritoActualizado));
};

// ---------- Vista de inicio (index.html) ----------
const iniciarInicio = (productos) => {
    const destacados = productos.filter(producto => producto.destacado === true);
    renderizarProductos(contenedorDestacados, destacados);
};

// ---------- Vista de catálogo (catalogo.html) ----------
const iniciarCatalogo = (productos) => {
    const formularioFiltros = document.getElementById("formulario-filtros");
    const radiosCategoria = document.querySelectorAll('input[name="categoria"]');
    const selectOrdenar = document.getElementById("id-ordenar");
    const inputBuscar = document.getElementById("id_buscar");
    const formularioBusqueda = document.querySelector(".barra-busqueda");

    // Estado de los filtros: se combinan categoría, texto y orden
    const filtros = {
        categoria: "Todas",
        texto: "",
        orden: "relevancia"
    };

    // Si venimos del buscador de otra página (catalogo.html?busqueda=...), usamos ese texto
    const parametros = new URLSearchParams(window.location.search);
    filtros.texto = parametros.get("busqueda") || "";
    inputBuscar.value = filtros.texto;

    const aplicarFiltros = () => {
        const filtrados = filtrarProductos(productos, filtros.categoria, filtros.texto);
        const ordenados = ordenarProductos(filtros.orden, filtrados);
        renderizarProductos(contenedorProductos, ordenados);
    };

    // Evento "change" en cada radio de categoría
    radiosCategoria.forEach(radio => {
        radio.addEventListener("change", (e) => {
            filtros.categoria = e.target.value;
            aplicarFiltros();
        });
    });

    // Evento "change" en el select de orden
    selectOrdenar.addEventListener("change", (e) => {
        filtros.orden = e.target.value;
        aplicarFiltros();
    });

    // Evento "input": filtra mientras el usuario escribe en el buscador
    inputBuscar.addEventListener("input", (e) => {
        filtros.texto = e.target.value;
        aplicarFiltros();
    });

    // En el catálogo los formularios de filtro y búsqueda no recargan la página
    formularioFiltros.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    formularioBusqueda.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    aplicarFiltros();
};

// ---------- Vista de detalle (detalle_producto.html) ----------
const iniciarDetalle = (productos) => {
    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parseInt(parametros.get("id"));
    const producto = obtenerProductoPorId(idProducto, productos);

    renderizarDetalle(contenedorDetalle, producto);

    if (!producto) {
        return;
    }

    // Referencias de los elementos que se acaban de renderizar
    const formularioAgregar = document.getElementById("formulario-agregar");
    const mensajeDetalle = document.getElementById("mensaje-detalle");

    formularioAgregar.addEventListener("submit", (e) => {
        e.preventDefault();

        const cantidad = Number(new FormData(formularioAgregar).get("cantidad"));
        const errores = validarCantidad(cantidad, CANTIDAD_MAXIMA);

        if (errores.length > 0) {
            mostrarMensaje(mensajeDetalle, errores, tiposMensaje.error);
            return;
        }

        agregarProducto(producto, cantidad);
        mostrarMensaje(mensajeDetalle, [`Agregaste ${cantidad} unidad(es) al carrito. <a href="./carrito.html">Ver carrito</a>`], tiposMensaje.exito);
    });
};

// ---------- Vista de ofertas (ofertas.html) ----------
const iniciarOfertas = (productos) => {
    renderizarOfertas(contenedorOfertas, productos);

    const mensajeOfertas = document.getElementById("mensaje-ofertas");
    const botonesAgregar = document.querySelectorAll(".boton-agregar");

    // Cada botón tiene el id del producto en el atributo data-id
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", () => {
            const producto = obtenerProductoPorId(Number(boton.dataset.id), productos);
            agregarProducto(producto, 1);
            mostrarMensaje(mensajeOfertas, [`Agregaste "${producto.nombre}" al carrito. <a href="./carrito.html">Ver carrito</a>`], tiposMensaje.exito);
        });
    });
};

// ---------- Vista del carrito (carrito.html) ----------
const iniciarCarrito = () => {
    const formularioPedido = document.getElementById("formulario-pedido");
    const botonFinalizar = document.getElementById("boton-finalizar");
    const selectProvincia = document.getElementById("id-provincia");
    const mensajePedido = document.getElementById("mensaje-pedido");
    const vistaCompra = document.getElementById("vista-compra");
    const vistaConfirmacion = document.getElementById("vista-confirmacion");
    const elementosResumen = {
        subtotal: document.getElementById("resumen-subtotal"),
        envio: document.getElementById("resumen-envio"),
        total: document.getElementById("resumen-total")
    };

    // Vuelve a dibujar el carrito y el resumen con los datos de localStorage
    const actualizarVista = () => {
        const carrito = leerCarrito();
        const subtotal = calcularSubtotal(carrito);
        const envio = calcularEnvio(subtotal, selectProvincia.value);

        renderizarCarrito(contenedorCarrito, carrito);
        renderizarResumen(elementosResumen, subtotal, envio, selectProvincia.value);
        actualizarContador(contadorCarrito, contarUnidades(carrito));
    };

    // Delegación de eventos: un solo escuchador para todos los botones "Quitar"
    contenedorCarrito.addEventListener("click", (e) => {
        if (e.target.classList.contains("boton-quitar")) {
            const id = Number(e.target.dataset.id);
            guardarCarrito(quitarDelCarrito(leerCarrito(), id));
            actualizarVista();
        }
    });

    // Cambio de cantidad en cualquier producto
    contenedorCarrito.addEventListener("change", (e) => {
        if (e.target.classList.contains("input-cantidad")) {
            const id = Number(e.target.dataset.id);
            const cantidad = Number(e.target.value);

            if (validarCantidad(cantidad, CANTIDAD_MAXIMA).length > 0) {
                e.target.value = 1;
                guardarCarrito(cambiarCantidad(leerCarrito(), id, 1));
            } else {
                guardarCarrito(cambiarCantidad(leerCarrito(), id, cantidad));
            }
            actualizarVista();
        }
    });

    // Al elegir la provincia se recalcula el envío
    selectProvincia.addEventListener("change", actualizarVista);

    // Envío del pedido por email (función asíncrona porque usa fetch)
    formularioPedido.addEventListener("submit", async (e) => {
        e.preventDefault();

        const carrito = leerCarrito();
        const cliente = construirCliente(formularioPedido);
        const errores = validarPedido(cliente, carrito);

        if (errores.length > 0) {
            mostrarMensaje(mensajePedido, errores, tiposMensaje.error);
            return;
        }

        const subtotal = calcularSubtotal(carrito);
        const envio = calcularEnvio(subtotal, cliente.provincia);
        const pedido = {
            numero: generarNumeroPedido(new Date()),
            items: carrito,
            subtotal,
            envio,
            total: subtotal + envio,
            cliente: {
                ...cliente,
                provincia: selectProvincia.options[selectProvincia.selectedIndex].text
            }
        };

        // Mientras se envía, deshabilitamos el botón para evitar pedidos duplicados
        botonFinalizar.disabled = true;
        botonFinalizar.textContent = "Enviando pedido...";

        try {
            await enviarPedido(pedido, armarDetallePedido(pedido));

            // Notificación en la interfaz y carrito vacío
            localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
            vaciarCarrito();
            actualizarContador(contadorCarrito, 0);
            vistaCompra.hidden = true;
            renderizarConfirmacion(vistaConfirmacion, pedido);
            vistaConfirmacion.hidden = false;
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            mostrarMensaje(mensajePedido, ["No pudimos enviar tu pedido. Revisá tu conexión e intentá de nuevo."], tiposMensaje.error);
        } finally {
            botonFinalizar.disabled = false;
            botonFinalizar.textContent = "Finalizar compra";
        }
    });

    formularioPedido.addEventListener("reset", () => {
        mensajePedido.innerHTML = "";
        // Esperamos a que el formulario se limpie y recalculamos el envío
        setTimeout(actualizarVista, 0);
    });

    actualizarVista();
};

// ---------- Vista de contacto (contacto.html) ----------
const iniciarContacto = () => {
    const mensajeFormulario = document.getElementById("mensaje-formulario");

    formularioContacto.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const datos = construirJSONContacto(formularioContacto);
        const errores = validarContacto(datos);

        if (errores.length > 0) {
            mostrarMensaje(mensajeFormulario, errores, tiposMensaje.error);
            return;
        }

        try {
            await enviarConsulta(datos);
            // Primero limpiamos el formulario (el evento "reset" borra los mensajes) y después avisamos
            formularioContacto.reset();
            mostrarMensaje(mensajeFormulario, ["¡Gracias! Tu consulta fue enviada correctamente."], tiposMensaje.exito);
        } catch (error) {
            mostrarMensaje(mensajeFormulario, ["No pudimos enviar tu consulta. Intentá de nuevo más tarde."], tiposMensaje.error);
            console.error(error);
        }
    });

    // Si el usuario toca "Limpiar", también borramos el mensaje
    formularioContacto.addEventListener("reset", () => {
        mensajeFormulario.innerHTML = "";
    });
};

// ---------- Inicio de la aplicación ----------
const iniciarApp = async () => {
    // El contador del carrito está en el encabezado de todas las páginas
    actualizarContador(contadorCarrito, contarUnidades(leerCarrito()));

    if (contenedorCarrito) {
        iniciarCarrito();
    }
    if (formularioContacto) {
        iniciarContacto();
    }

    // Las vistas que muestran productos necesitan cargar el JSON
    const necesitaProductos = contenedorDestacados || contenedorProductos || contenedorDetalle || contenedorOfertas;
    if (!necesitaProductos) {
        return;
    }

    try {
        const productos = await obtenerProductos();

        if (contenedorDestacados) {
            iniciarInicio(productos);
        }
        if (contenedorProductos) {
            iniciarCatalogo(productos);
        }
        if (contenedorDetalle) {
            iniciarDetalle(productos);
        }
        if (contenedorOfertas) {
            iniciarOfertas(productos);
        }
    } catch (error) {
        console.error(error);
        const contenedor = contenedorDestacados || contenedorProductos || contenedorDetalle || contenedorOfertas;
        contenedor.innerHTML = `<p class="mensaje mensaje--error">No pudimos cargar los productos. Recargá la página o intentá más tarde.</p>`;
    }
};

iniciarApp();
