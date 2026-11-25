// ---------- Módulo del carrito ----------
// Responsabilidad: la lógica del carrito, sin DOM ni localStorage: cada función recibe el carrito
// (un arreglo de objetos) y devuelve uno NUEVO, sin modificar el original.

import { calcularPrecioFinal } from './filtros.js';

const CANTIDAD_MAXIMA = 10;
const ENVIO_GRATIS_DESDE = 50000;
const COSTO_ENVIO_CORDOBA = 3500;
const COSTO_ENVIO_RESTO = 7500;

// Agrega un producto. Si ya estaba, suma la cantidad (con un tope de 10)
const agregarAlCarrito = (carrito, producto, cantidad) => {
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
        return carrito.map(item => item.id === producto.id
            ? { ...item, cantidad: Math.min(item.cantidad + cantidad, CANTIDAD_MAXIMA) }
            : item
        );
    }

    const nuevoItem = {
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: calcularPrecioFinal(producto),
        cantidad: Math.min(cantidad, CANTIDAD_MAXIMA)
    };

    return [...carrito, nuevoItem];
};

// Cambia la cantidad de un producto del carrito
const cambiarCantidad = (carrito, id, cantidad) => {
    return carrito.map(item => item.id === id ? { ...item, cantidad } : item);
};

// Quita un producto del carrito
const quitarDelCarrito = (carrito, id) => {
    return carrito.filter(item => item.id !== id);
};

// Cantidad total de unidades
const contarUnidades = (carrito) => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
};

// Suma precio x cantidad de cada producto
const calcularSubtotal = (carrito) => {
    return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
};

// Envío: gratis desde $50.000, si no depende de la provincia
const calcularEnvio = (subtotal, provincia) => {
    if (subtotal === 0 || provincia === "") {
        return 0;
    }
    if (subtotal >= ENVIO_GRATIS_DESDE) {
        return 0;
    }
    return provincia === "cordoba" ? COSTO_ENVIO_CORDOBA : COSTO_ENVIO_RESTO;
};

// Genera un número de pedido a partir de la fecha (ej: AF-482913)
const generarNumeroPedido = (fecha) => {
    return `AF-${String(fecha.getTime()).slice(-6)}`;
};

// Arma el detalle de texto del pedido que se envía por email
const armarDetallePedido = (pedido) => {
    const lineasProductos = pedido.items
        .map(item => `- ${item.cantidad} x ${item.nombre} ($${item.precio * item.cantidad})`)
        .join("\n");

    return `${lineasProductos}\n\n`
        + `Subtotal: $${pedido.subtotal}\n`
        + `Envío: $${pedido.envio}\n`
        + `Total: $${pedido.total}\n\n`
        + `Nota: ${pedido.cliente.nota || "Sin nota"}`;
};

export {
    CANTIDAD_MAXIMA,
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    contarUnidades,
    calcularSubtotal,
    calcularEnvio,
    generarNumeroPedido,
    armarDetallePedido
};
