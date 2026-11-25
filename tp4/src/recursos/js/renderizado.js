// ---------- Módulo de renderizado ----------
// Responsabilidad: armar el HTML con template literals e inyectarlo en el DOM.

//Función que renderiza todos los productos (catalogo.html)
const renderizarProductos = (contenedor, arregloProductos) => {
    let productosHTML = '';

    arregloProductos.forEach(producto => {
        productosHTML += `
            <article class="tarjeta-producto">
                    <figure>
                        <a href="./detalle_producto.html?id=${producto.id}">
                            <img src= "${producto.imagen}" alt="${producto.nombre}">
                        </a>
                    </figure>
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p><strong>$${producto.precioFinal.toLocaleString()}</strong></p>
                    <a href="./detalle_producto.html?id=${producto.id}" class="boton-principal">Ver detalle</a>
                </article>
        `;
    });

    contenedor.innerHTML = productosHTML;
    return productosHTML;
};

// Función para renderizar todo el detalle usando template literals
const renderizarDetalle = (contenedor, producto) => {
    if (!producto) {
        contenedor.innerHTML = "<h2>Producto no encontrado</h2>";
        return;
    }

    // Recorremos el array de nutrición para armar las filas <tr> de la tabla dinámicamente
    let filasNutricionHTML = "";
    producto.nutricion.forEach(item => {
        filasNutricionHTML += `
            <tr>
                <td><strong>${item.nutriente}</strong></td>
                <td>${item.cantidad}</td>
            </tr>
        `;
    });

    // Cargamos todo el bloque HTML en el contenedor principal
    contenedor.innerHTML = `
        <h1>Detalle del Producto</h1>
        <section class="tarjeta-oferta">
            <figure>
                <img src="${producto.imagen}" alt="${producto.nombre}" height="400">
            </figure>
            <div>
                <h2>${producto.nombre}</h2>
                <p><strong>Marca:</strong> ${producto.marca}</p>
                <p><strong>$${producto.precioFinal.toLocaleString()}</strong> ${producto.cuotas}</p>
                <p>${producto.descripcion}</p>
                <p><strong>Sabor:</strong> ${producto.sabor}</p>
                <form action="./carrito.html" method="post">
                    <div>
                        <label for="id-cantidad"><strong>Cantidad:</strong></label>
                        <input type="number" id="id-cantidad" name="cantidad" min="1" value="1" max="10" required>
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


// Función para cargar las Ofertas en la página de Ofertas (ofertas.html)
const renderizarOfertas = (contenedor, arregloProductos) => {
    // Filtramos los productos que están en oferta
    const productosEnOferta = arregloProductos.filter(prod => prod.enOferta === true);

    if (productosEnOferta.length === 0) {
        contenedor.innerHTML = "<p>No hay ofertas disponibles por el momento.</p>";
        return;
    }

    //  Separamos el primer producto como el "Combo imperdible" y el resto como "Otros productos"
    const comboImperdible = productosEnOferta[0];
    const otrosProductos = productosEnOferta.slice(1);

    let htmlOfertas = '<h1>Ofertas</h1>';

    // Generamos la sección de "Combo imperdible"
    if (comboImperdible) {
        htmlOfertas += `
            <section>
                <h2>Combo imperdible</h2>
                <article class="tarjeta-oferta">
                    <figure class="oferta-imagen">
                        <a href="./detalle_producto.html?id=${comboImperdible.id}">
                            <img src="${comboImperdible.imagen}" alt="${comboImperdible.nombre}">
                        </a>
                    </figure>
                    <div class="oferta-contenido">
                        <h3>${comboImperdible.nombre}</h3>
                        <div class="oferta-precio-fila">
                            <span class="etiqueta-descuento">${comboImperdible.descuento * 100}% OFF</span>
                            <span class="precio-final">$${comboImperdible.precioFinal.toLocaleString()}</span>
                        </div>
                        <p>${comboImperdible.descripcion}</p>
                        <a href="./carrito.html" class="boton-principal">Agregar al carrito</a>
                    </div>
                </article>
            </section>
        `;
    }

    // Generamos la sección de "Otros productos en oferta" si existen
    if (otrosProductos.length > 0) {
        htmlOfertas += `<section><h2>Otros productos en oferta</h2>`;
        
        otrosProductos.forEach(producto => {
            htmlOfertas += `
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
                            <span class="precio-final">$${producto.precioFinal.toLocaleString()}</span>
                        </div>
                        <p>${producto.descripcion}</p>
                        <a href="./carrito.html" class="boton-principal">Agregar al carrito</a>
                    </div>
                </article>
            `;
        });
        htmlOfertas += `</section>`;
    }

    // Cargamos todo en el contenedor general
    contenedor.innerHTML = htmlOfertas;
};


// Muestra mensajes (de error o de éxito) en el contenedor
const mostrarMensajeContacto = (contenedor, mensajes, esError) => {
    const color = esError ? "#DC2626" : "#15803D";
    contenedor.innerHTML = `
        <ul style="color:${color}; font-weight:bold;">
            ${mensajes.map(m => `<li>${m}</li>`).join("")}
        </ul>
    `;
};

export { renderizarProductos, renderizarDetalle, renderizarOfertas, mostrarMensajeContacto };
