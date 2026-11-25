// ---------- Módulo de datos ----------
// Responsabilidad: obtener y guardar datos (fetch del JSON, sessionStorage y localStorage).
// Obtiene los productos del archivo JSON con fetch() y guarda el carrito con localStorage.

const URL_PRODUCTOS = "./recursos/datos/productos.json";
const CLAVE_PRODUCTOS = "productos";
const CLAVE_CARRITO = "carrito";

// Descarga un recurso JSON con fetch. Si la respuesta no es correcta, lanza un error
const fetchDatos = async (url) => {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${url} (estado ${respuesta.status})`);
    }
    return await respuesta.json();
};

// Estrategia de caché: si los productos ya están en la sesión, no los volvemos a descargar
const obtenerProductos = async () => {
    const guardados = sessionStorage.getItem(CLAVE_PRODUCTOS);

    if (guardados) {
        return JSON.parse(guardados);
    }

    const productos = await fetchDatos(URL_PRODUCTOS);
    sessionStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
    return productos;
};

// Lee el carrito guardado. Si no hay nada o el dato está dañado, devuelve un carrito vacío
const leerCarrito = () => {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
        console.error("El carrito guardado no es válido, se reinicia.", error);
        localStorage.removeItem(CLAVE_CARRITO);
        return [];
    }
};

// Guarda el carrito en localStorage (solo se pueden guardar cadenas, por eso JSON.stringify)
const guardarCarrito = (carrito) => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
};

// Vacía el carrito (después de confirmar el pedido)
const vaciarCarrito = () => {
    localStorage.removeItem(CLAVE_CARRITO);
};

export { fetchDatos, obtenerProductos, leerCarrito, guardarCarrito, vaciarCarrito };
