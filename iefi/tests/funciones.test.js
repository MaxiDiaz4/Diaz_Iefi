// Tests unitarios con el test runner nativo de Node (node:test).
// Se ejecutan con: npm test   (que corre "node --test")
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularPrecioFinal } from '../src/recursos/js/filtros.js';
import { calcularSubtotal } from '../src/recursos/js/carrito.js';

test('calcularPrecioFinal aplica el descuento del producto', () => {
    const producto = { precio: 100000, descuento: 0.2 };
    assert.equal(calcularPrecioFinal(producto), 80000);
});

test('calcularSubtotal suma precio por cantidad de cada producto', () => {
    const carrito = [
        { precio: 100, cantidad: 2 },
        { precio: 50, cantidad: 1 }
    ];
    assert.equal(calcularSubtotal(carrito), 250);
});
