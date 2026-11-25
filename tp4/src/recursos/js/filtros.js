// ---------- Módulo de filtros ----------
// Responsabilidad: filtrar, ordenar y buscar productos (no toca el DOM).

import { productos } from './productos.js';

//Función de filtrado por categoría
const filtrarPorCategoria = (categoriaSeleccionada) => {
    if (categoriaSeleccionada === "Todas") {
        return productos.filter(prod => prod.categoria !== "Ofertas"); // Devuelve todos excepto los de la categoría "Ofertas"
    }
    // Filtra el array original según la categoría
    return productos.filter(prod => prod.categoria === categoriaSeleccionada);
};

//Función de ordenamiento
const ordenarProductos = (criterio, arregloA1Ordenar) => {
    // Hacemos una copia del array para no modificar el original
    const arregloCopia = [...arregloA1Ordenar];

    if (criterio === "precio-bajo") {
        return arregloCopia.sort((a, b) => a.precio - b.precio);
    } else if (criterio === "precio-alto") {
        return arregloCopia.sort((a, b) => b.precio - a.precio);
    } else if (criterio === "nombre") {
        return arregloCopia.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    
    return arregloCopia; // Si es "relevancia" u otro, devuelve el orden por defecto
};

//  Funciones para cargar el detalle del producto (detalle_producto.html)
// Función para buscar un producto por ID
const obtenerProductoPorId = (id, arregloProductos) => {
    return arregloProductos.find(producto => producto.id === id);
};

export { filtrarPorCategoria, ordenarProductos, obtenerProductoPorId };
