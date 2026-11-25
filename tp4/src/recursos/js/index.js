// ---------- Archivo principal (eventos) ----------
// Responsabilidad: referencias al DOM y escuchadores de eventos de cada vista.
// El resto de la lógica está separada por responsabilidad:
// productos.js (datos), filtros.js, renderizado.js, validaciones.js y formularios.js

//  Importaciones
import { productos } from './productos.js';
import { filtrarPorCategoria, ordenarProductos, obtenerProductoPorId } from './filtros.js';
import { renderizarProductos, renderizarDetalle, renderizarOfertas, mostrarMensajeContacto } from './renderizado.js';
import { validarContacto } from './validaciones.js';
import { construirJSONContacto, enviarContacto } from './formularios.js';

// ---Vista de catálogo (catalogo.html) ---
//  Referencias DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const radiosCategoria = document.querySelectorAll('input[name="categoria"]');
const selectOrdenar = document.getElementById("id-ordenar");

//  Funciones
//Estado actual (para mantener el filtro activo si luego ordenamos, o viceversa)
let productosActuales = productos.filter(producto => producto.enOferta === false);
if (contenedorProductos) {
    //Función que carga todos los productos
    renderizarProductos(contenedorProductos, productosActuales);

    //  Eventos
    //  Evento para el filtrado de categorías (radio buttons con el evento 'change')
    radiosCategoria.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const categoriaElegida = e.target.value;

            // Usamos la función genérica pasando la categoría
            productosActuales = filtrarPorCategoria(categoriaElegida);

            // Volvemos a renderizar el contenedor con el resultado filtrado
            renderizarProductos(contenedorProductos, productosActuales);
        });
    });

    //Evento para el filtrado según un orden(Usando 'change')
    selectOrdenar.addEventListener("change", (e) => {
        const criterioElegido = e.target.value; // Captura el value ('precio-bajo', 'nombre', etc.)
        
        // Ordenamos sobre los productos que ya están filtrados actualmente
        const productosOrdenados = ordenarProductos(criterioElegido, productosActuales);
        
        renderizarProductos(contenedorProductos, productosOrdenados);
    });
}



// ---Vista de detalle (detalle_producto.html) ---
// Referencias DOM
const contenedorDetalle = document.getElementById('contenedor-detalle');

//  Funciones
if (contenedorDetalle) {
    // Si estamos en la página de detalle, leemos la URL y renderizamos
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(urlParams.get('id'));
    
    const productoSeleccionado = obtenerProductoPorId(idProducto, productos);
    renderizarDetalle(contenedorDetalle, productoSeleccionado);
}



// ---Vista de ofertas (ofertas.html) ---
//  Referencias DOM
const contenedorOfertas = document.getElementById('contenedor-ofertas');

//  Funciones
if (contenedorOfertas) {
    // Ejecutamos la función de renderizado de ofertas pasándole los datos
    renderizarOfertas(contenedorOfertas, productos);
}



// ---Vista de contacto (contacto.html) ---
// Referencias DOM
const formularioContacto = document.getElementById('formulario-contacto');
const mensajeFormulario = document.getElementById('mensaje-formulario');

if (formularioContacto) {
    formularioContacto.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const datos = construirJSONContacto(formularioContacto);
        const errores = validarContacto(datos);

        if (errores.length > 0) {
            mostrarMensajeContacto(mensajeFormulario, errores, true);
            return;
        }

        try {
            const resultado = await enviarContacto(datos);
            console.log("Respuesta del servidor:", resultado);
            mostrarMensajeContacto(mensajeFormulario, ["¡Gracias! Tu consulta fue enviada correctamente."], false);
            formularioContacto.reset();
        } catch (error) {
            mostrarMensajeContacto(mensajeFormulario, ["No pudimos enviar tu consulta. Intentá de nuevo más tarde."], true);
            console.error(error);
        }
    });

    // Si el usuario toca "Limpiar", también borramos el mensaje
    formularioContacto.addEventListener("reset", () => {
        mensajeFormulario.innerHTML = "";
    });
}