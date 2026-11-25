// ---------- Módulo de validaciones ----------
// Responsabilidad: validar con JavaScript los datos de los formularios.

// Valida los datos y devuelve un arreglo con los errores encontrados
const validarContacto = (datos) => {
    const errores = [];
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefono = /^[0-9+\s()-]{8,15}$/;

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

export { validarContacto };
