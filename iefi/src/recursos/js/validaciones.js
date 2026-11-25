// ---------- Módulo de validaciones ----------
// Responsabilidad: validar los datos de los formularios.
// Validaciones con JavaScript que complementan las validaciones HTML
// (required, minlength, pattern, type="email") de los formularios.
// Cada función devuelve un arreglo con los errores encontrados (vacío = todo OK).

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^[0-9+\s()-]{8,15}$/;
const regexTelefonoPedido = /^\+?[0-9 ]{8,15}$/;
const regexCodigoPostal = /^[0-9]{4}$/;

// Formulario de contacto (contacto.html)
const validarContacto = (datos) => {
    const errores = [];

    if (datos.nombre.length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres.");
    }
    if (datos.apellido.length < 2) {
        errores.push("El apellido debe tener al menos 2 caracteres.");
    }
    if (!regexEmail.test(datos.correo)) {
        errores.push("Ingresá un correo electrónico válido.");
    }
    // El teléfono es opcional: solo se valida si el usuario lo completó
    if (datos.telefono !== "" && !regexTelefono.test(datos.telefono)) {
        errores.push("El teléfono solo puede tener números, espacios, +, ( ) y -, entre 8 y 15 caracteres.");
    }
    if (datos.comentario.length < 10) {
        errores.push("El mensaje debe tener al menos 10 caracteres.");
    }

    return errores;
};

// Cantidad elegida en el detalle del producto
const validarCantidad = (cantidad, maximo) => {
    const errores = [];

    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > maximo) {
        errores.push(`La cantidad debe ser un número entero entre 1 y ${maximo}.`);
    }

    return errores;
};

// Formulario de finalización de compra (carrito.html)
const validarPedido = (cliente, carrito) => {
    const errores = [];

    if (carrito.length === 0) {
        errores.push("Tu carrito está vacío.");
    }
    if (cliente.nombre.length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres.");
    }
    if (cliente.apellido.length < 2) {
        errores.push("El apellido debe tener al menos 2 caracteres.");
    }
    if (!regexEmail.test(cliente.email)) {
        errores.push("Ingresá un correo electrónico válido.");
    }
    if (!regexTelefonoPedido.test(cliente.telefono)) {
        errores.push("Ingresá un teléfono válido: solo números (puede empezar con +), entre 8 y 15 caracteres.");
    }
    if (cliente.provincia === "") {
        errores.push("Seleccioná tu provincia.");
    }
    if (!regexCodigoPostal.test(cliente.codigoPostal)) {
        errores.push("El código postal debe tener 4 números.");
    }
    if (cliente.direccion.length < 5) {
        errores.push("Ingresá la dirección de entrega (calle y número).");
    }

    return errores;
};

export { validarContacto, validarCantidad, validarPedido };
