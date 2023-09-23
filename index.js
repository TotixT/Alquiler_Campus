import express from 'express';
import dotenv from 'dotenv';
import router from './router/endpoints.router.js';
import routerCliente from './router/cliente.router.js';
import routerSucursal from './router/sucursal.router.js';
import routerSucursal_Automovil from './router/suc_aut.router.js';
import routerEmpleado from './router/empleado.router.js';
import routerAutomovil from './router/automovil.router.js';
import routerAlquiler from './router/alquiler.router.js';
import routerReserva from './router/reserva.router.js';

import { connection } from './connection/connectionDB.js';

connection();

dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(express.json());

// EndPoints
app.use('/Alquiler', router)

// CRUD's
app.use('/clientes', routerCliente)
app.use('/sucursal', routerSucursal)
app.use('/automovil', routerAutomovil)
app.use('/empleado', routerEmpleado)
app.use('/suc_aut', routerSucursal_Automovil)
app.use('/alquiler', routerAlquiler)
app.use('/reserva', routerReserva)
// No sabia si hacerlos o no, ya que 
// app.use('/entrega', routerEntrega)
// app.use('/devolucion', routerDevolucion)

app.listen(port, () => {
    console.log(`Escuchando al Server en el puerto: ${port}`);
})