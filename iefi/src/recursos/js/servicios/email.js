// ---------- Servicio de email ----------
// Responsabilidad: enviar emails reales con Web3Forms usando fetch.
// Web3Forms recibe los datos, se fija a qué mail corresponde la access_key y los reenvía a esa casilla.

import { CONFIG } from '../config.js';

const URL_API = "https://api.web3forms.com/submit";

// Función base: hace el POST con los datos en JSON junto con la access_key
const enviarEmail = async (datos) => {
    const respuesta = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: CONFIG.web3formsKey, ...datos }),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.success) {
        throw new Error(`Web3Forms: ${resultado.message}`);
    }
    return resultado;
};

// Consulta del formulario de contacto (contacto.html)
const enviarConsulta = async (datos) => {
    return await enviarEmail({
        subject: "Nueva consulta - Apex Fit",
        from_name: `${datos.nombre} ${datos.apellido}`,
        email: datos.correo,
        telefono: datos.telefono || "No informado",
        mensaje: datos.comentario,
    });
};

// Pedido del carrito (carrito.html)
const enviarPedido = async (pedido, detalle) => {
    return await enviarEmail({
        subject: `Nuevo pedido ${pedido.numero} - Apex Fit`,
        from_name: `${pedido.cliente.nombre} ${pedido.cliente.apellido}`,
        email: pedido.cliente.email,
        telefono: pedido.cliente.telefono,
        direccion: `${pedido.cliente.direccion}, ${pedido.cliente.provincia} (CP ${pedido.cliente.codigoPostal})`,
        pedido: detalle,
        total: `$${pedido.total}`,
    });
};

export { enviarConsulta, enviarPedido };
