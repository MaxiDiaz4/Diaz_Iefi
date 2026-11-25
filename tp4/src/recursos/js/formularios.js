// ---------- Módulo de formularios ----------
// Responsabilidad: leer los datos de los formularios con FormData y armar los objetos a enviar.

// Arma el objeto con los datos del cliente del formulario de compra (carrito.html)
const construirCliente = (formulario) => {
    const datosForm = new FormData(formulario);
    return {
        nombre: datosForm.get("nombre").trim(),
        apellido: datosForm.get("apellido").trim(),
        email: datosForm.get("email").trim(),
        telefono: datosForm.get("telefono").trim(),
        provincia: datosForm.get("provincia") || "",
        codigoPostal: datosForm.get("codigo-postal").trim(),
        direccion: datosForm.get("direccion").trim(),
        nota: datosForm.get("nota").trim()
    };
};

// Construye el objeto JSON con los datos del formulario de contacto (contacto.html)
const construirJSONContacto = (formulario) => {
    const datosForm = new FormData(formulario);
    return {
        nombre: datosForm.get("nombre").trim(),
        apellido: datosForm.get("apellido").trim(),
        correo: datosForm.get("correo").trim(),
        telefono: datosForm.get("telefono").trim(),
        comentario: datosForm.get("comentario").trim(),
        fecha: new Date().toISOString()
    };
};

export { construirCliente, construirJSONContacto };
