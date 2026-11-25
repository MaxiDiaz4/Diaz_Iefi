// ---------- Módulo de formularios ----------
// Responsabilidad: leer los datos de los formularios (FormData) y enviarlos al servidor con fetch.

// Construye el objeto JSON con los datos del formulario
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

// Envía el JSON al servidor usando fetch
const enviarContacto = async (datos) => {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
    }
    return await respuesta.json();
};

export { construirJSONContacto, enviarContacto };
