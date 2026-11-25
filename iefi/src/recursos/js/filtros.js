// ---------- Módulo de filtros ----------
// Responsabilidad: filtrar, ordenar y calcular precios de los productos.
// Funciones "puras": reciben datos y devuelven un resultado, sin tocar el DOM.
// Por eso se pueden probar con el test runner nativo de Node (carpeta tests/).

// Calcula el precio final aplicando el descuento (ej: 0.2 = 20% OFF)
const calcularPrecioFinal = (producto) => {
    return Math.round(producto.precio - (producto.precio * producto.descuento));
};

// Filtra por categoría y por texto de búsqueda al mismo tiempo
const filtrarProductos = (productos, categoria, texto) => {
    const textoBuscado = texto.trim().toLowerCase();

    return productos.filter(producto => {
        const coincideCategoria = categoria === "Todas" || producto.categoria === categoria;
        const coincideTexto = textoBuscado === ""
            || producto.nombre.toLowerCase().includes(textoBuscado)
            || producto.marca.toLowerCase().includes(textoBuscado)
            || producto.sabor.toLowerCase().includes(textoBuscado);

        return coincideCategoria && coincideTexto;
    });
};

// Ordena una copia del arreglo (no modifica el original)
const ordenarProductos = (criterio, productos) => {
    const copia = [...productos];

    if (criterio === "precio-bajo") {
        return copia.sort((a, b) => calcularPrecioFinal(a) - calcularPrecioFinal(b));
    } else if (criterio === "precio-alto") {
        return copia.sort((a, b) => calcularPrecioFinal(b) - calcularPrecioFinal(a));
    } else if (criterio === "nombre") {
        return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return copia; // "relevancia": orden original del JSON
};

// Busca un producto por su id
const obtenerProductoPorId = (id, productos) => {
    return productos.find(producto => producto.id === id);
};

export { calcularPrecioFinal, filtrarProductos, ordenarProductos, obtenerProductoPorId };
