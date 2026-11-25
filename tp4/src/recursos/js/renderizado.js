// ---------- Módulo de renderizado ----------
// Responsabilidad: armar el HTML con template literals e inyectarlo en el DOM.
// No lee formularios ni se comunica con el servidor.

import { calcularPrecioFinal } from './filtros.js';

// Formatea un número como precio argentino: 49999 -> $49.999
const formatearPrecio = (numero) => {
    return `$${numero.toLocaleString("es-AR")}`;
};

// ---------- Catálogo e inicio ----------

// Plantilla de una tarjeta de producto
const plantillaTarjeta = (producto) => {
    const etiquetaOferta = producto.enOferta
        ? `<span class="etiqueta-descuento">${producto.descuento * 100}% OFF</span>`
        : "";

    return `
        <article class="tarjeta-producto">
            <figure>
                <a href="./detalle_producto.html?id=${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </a>
            </figure>
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>${etiquetaOferta} <strong>${formatearPrecio(calcularPrecioFinal(producto))}</strong></p>
            <a href="./detalle_producto.html?id=${producto.id}" class="boton-principal">Ver detalle</a>
        </article>
    `;
};

// Renderiza una lista de productos (catalogo.html e index.html)
const renderizarProductos = (contenedor, productos) => {
    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="sin-resultados">No encontramos productos con esos filtros.</p>`;
        return;
    }

    let productosHTML = "";
    productos.forEach(producto => {
        productosHTML += plantillaTarjeta(producto);
    });
    contenedor.innerHTML = productosHTML;
};

// ---------- Detalle del producto (detalle_producto.html) ----------

const renderizarDetalle = (contenedor, producto) => {
    if (!producto) {
        contenedor.innerHTML = `
            <h1>Producto no encontrado</h1>
            <p><a href="./catalogo.html" class="boton-principal">Volver al catálogo</a></p>
        `;
        return;
    }

    let filasNutricionHTML = "";
    producto.nutricion.forEach(item => {
        filasNutricionHTML += `
            <tr>
                <td><strong>${item.nutriente}</strong></td>
                <td>${item.cantidad}</td>
            </tr>
        `;
    });

    const precioAnterior = producto.enOferta
        ? `<span class="precio-anterior">${formatearPrecio(producto.precio)}</span> <span class="etiqueta-descuento">${producto.descuento * 100}% OFF</span>`
        : "";

    contenedor.innerHTML = `
        <h1>Detalle del Producto</h1>
        <section class="tarjeta-oferta">
            <figure>
                <img src="${producto.imagen}" alt="${producto.nombre}" height="400">
            </figure>
            <div>
                <h2>${producto.nombre}</h2>
                <p><strong>Marca:</strong> ${producto.marca}</p>
                <p>${precioAnterior}</p>
                <p><strong>${formatearPrecio(calcularPrecioFinal(producto))}</strong> ${producto.cuotas}</p>
                <p>${producto.descripcion}</p>
                <p><strong>Sabor:</strong> ${producto.sabor}</p>
                <div id="mensaje-detalle" role="alert"></div>
                <form id="formulario-agregar" data-id="${producto.id}">
                    <div>
                        <label for="id-cantidad"><strong>Cantidad:</strong></label>
                        <input type="number" id="id-cantidad" name="cantidad" min="1" max="10" value="1" required>
                        <button type="submit" class="boton-principal">Agregar al carrito</button>
                    </div>
                </form>
            </div>
        </section>

        <section>
            <h3>Información Nutricional</h3>
            <table>
                <caption>Valores nutricionales por porción (${producto.porcion})</caption>
                <thead>
                    <tr>
                        <th scope="col">Nutrientes</th>
                        <th scope="col">Cantidad por porción</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasNutricionHTML}
                </tbody>
            </table>
        </section>
    `;
};

// ---------- Ofertas (ofertas.html) ----------

// Plantilla de una tarjeta de oferta. El botón guarda el id en data-id
const plantillaOferta = (producto) => {
    return `
        <article class="tarjeta-oferta">
            <figure class="oferta-imagen">
                <a href="./detalle_producto.html?id=${producto.id}">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </a>
            </figure>
            <div class="oferta-contenido">
                <h3>${producto.nombre}</h3>
                <div class="oferta-precio-fila">
                    <span class="etiqueta-descuento">${producto.descuento * 100}% OFF</span>
                    <span class="precio-anterior">${formatearPrecio(producto.precio)}</span>
                    <span class="precio-final">${formatearPrecio(calcularPrecioFinal(producto))}</span>
                </div>
                <p>${producto.descripcion}</p>
                <button type="button" class="boton-principal boton-agregar" data-id="${producto.id}">Agregar al carrito</button>
            </div>
        </article>
    `;
};

const renderizarOfertas = (contenedor, productos) => {
    const productosEnOferta = productos.filter(producto => producto.enOferta === true);

    if (productosEnOferta.length === 0) {
        contenedor.innerHTML = "<h1>Ofertas</h1><p>No hay ofertas disponibles por el momento.</p>";
        return;
    }

    // El primero es el "Combo imperdible" y el resto "Otros productos en oferta"
    const [comboImperdible, ...otrosProductos] = productosEnOferta;

    let htmlOfertas = `
        <h1>Ofertas</h1>
        <div id="mensaje-ofertas" role="alert"></div>
        <section>
            <h2>Combo imperdible</h2>
            ${plantillaOferta(comboImperdible)}
        </section>
    `;

    if (otrosProductos.length > 0) {
        htmlOfertas += `<section><h2>Otros productos en oferta</h2>`;
        otrosProductos.forEach(producto => {
            htmlOfertas += plantillaOferta(producto);
        });
        htmlOfertas += `</section>`;
    }

    contenedor.innerHTML = htmlOfertas;
};

// ---------- Carrito (carrito.html) ----------

const renderizarCarrito = (contenedor, carrito) => {
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <p>Tu carrito está vacío.</p>
            <p><a href="./catalogo.html" class="boton-principal">Ir al catálogo</a></p>
        `;
        return;
    }

    let carritoHTML = "";
    carrito.forEach(item => {
        carritoHTML += `
            <article class="producto-carrito">
                <img src="${item.imagen}" alt="${item.nombre}" width="100">
                <div class="info-producto-carrito">
                    <h3>${item.nombre}</h3>
                    <p>${formatearPrecio(item.precio)} c/u</p>
                    <p><strong>${formatearPrecio(item.precio * item.cantidad)}</strong></p>
                </div>
                <div class="cantidad-carrito">
                    <div class="campo-form">
                        <label for="id-cantidad-${item.id}">Cantidad</label>
                        <input type="number" id="id-cantidad-${item.id}" class="input-cantidad" data-id="${item.id}" min="1" max="10" value="${item.cantidad}">
                    </div>
                    <button type="button" class="boton-secundario boton-quitar" data-id="${item.id}">Quitar</button>
                </div>
            </article>
        `;
    });
    contenedor.innerHTML = carritoHTML;
};

// Actualiza los montos del resumen de compra
const renderizarResumen = (elementos, subtotal, envio, provincia) => {
    elementos.subtotal.textContent = formatearPrecio(subtotal);

    if (provincia === "") {
        elementos.envio.textContent = "A calcular";
    } else if (envio === 0) {
        elementos.envio.textContent = "¡Gratis!";
    } else {
        elementos.envio.textContent = formatearPrecio(envio);
    }

    elementos.total.textContent = formatearPrecio(subtotal + envio);
};

// Pantalla de confirmación del pedido
const renderizarConfirmacion = (contenedor, pedido) => {
    let itemsHTML = "";
    pedido.items.forEach(item => {
        itemsHTML += `<li>${item.cantidad} x ${item.nombre}: ${formatearPrecio(item.precio * item.cantidad)}</li>`;
    });

    contenedor.innerHTML = `
        <section class="contenedor-formulario confirmacion-pedido" role="status">
            <h2>¡Pedido confirmado!</h2>
            <p>Tu número de pedido es <strong>${pedido.numero}</strong>.</p>
            <p>Recibimos tu pedido por email. Te vamos a escribir a <strong>${pedido.cliente.email}</strong> para coordinar el pago y la entrega.</p>
            <ul>${itemsHTML}</ul>
            <p>Envío: ${pedido.envio === 0 ? "Gratis" : formatearPrecio(pedido.envio)}</p>
            <p><strong>Total: ${formatearPrecio(pedido.total)}</strong></p>
            <p>¡Gracias por tu compra, ${pedido.cliente.nombre}!</p>
            <p><a href="./catalogo.html" class="boton-principal">Seguir comprando</a></p>
        </section>
    `;
};

// ---------- Mensajes / notificaciones ----------

// Tipos de mensaje (Symbol, como en el ejercicio resuelto del TID)
const tiposMensaje = {
    error: Symbol("error"),
    exito: Symbol("exito")
};

// Muestra una lista de mensajes de error o de éxito en el contenedor indicado
const mostrarMensaje = (contenedor, mensajes, tipo) => {
    const clase = tipo === tiposMensaje.error ? "mensaje mensaje--error" : "mensaje mensaje--exito";
    contenedor.innerHTML = `
        <ul class="${clase}">
            ${mensajes.map(mensaje => `<li>${mensaje}</li>`).join("")}
        </ul>
    `;
};

// Actualiza el contador del ícono del carrito en el encabezado
const actualizarContador = (elemento, unidades) => {
    if (!elemento) {
        return;
    }
    elemento.textContent = unidades;
    elemento.hidden = unidades === 0;
};

export {
    formatearPrecio,
    renderizarProductos,
    renderizarDetalle,
    renderizarOfertas,
    renderizarCarrito,
    renderizarResumen,
    renderizarConfirmacion,
    tiposMensaje,
    mostrarMensaje,
    actualizarContador
};
