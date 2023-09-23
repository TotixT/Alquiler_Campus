import express from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import { client } from "../connection/connectionDB.js";
import { ObjectId } from "mongodb";

const router = express.Router();
router.use(express.json());

const db = client.db("alquiler");

const automovil = db.collection("automovil");
const cliente = db.collection("cliente");
const empleado = db.collection("empleado");
const sucursal = db.collection("sucursal");
const sucursal_automovil = db.collection("sucursal_automovil");
const reserva = db.collection("reserva");
const alquiler = db.collection("alquiler");

// 2. Mostrar todos los clientes registrados en la base de datos.

const EndPoint2 = async (req, res) => {
    try {
        const result = await cliente.find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
};

// 3. Obtener todos los automóviles disponibles para alquiler.

const EndPoint3 = async (req, res) => {
    try {
        // Realiza la lógica para buscar todos los automóviles disponibles...
        const automovilesDisponibles = await automovil
            .find({
                _id: {
                    $nin: await alquiler.distinct('aut_id', {
                        alq_estado: 'En Curso'
                    })
                }
            })
            .toArray();

        res.send(automovilesDisponibles);
    } catch (error) {
        console.error('Error al buscar automóviles disponibles:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 4. Listar todos los alquileres activos junto con los datos de los clientes relacionados

const EndPoint4 = async (req, res) => {
    try {
        const alquileresActivos = await alquiler.aggregate([
            {
                $match: { alq_estado: 'En Curso' }
            },
            {
                $lookup: {
                    from: 'cliente',
                    localField: 'cli_id',
                    foreignField: '_id',
                    as: 'cliente'
                }
            },
            {
                $set: {
                    'cli_id': { $arrayElemAt: ['$cliente', 0] }
                }
            },
            {
                $project: { cliente: 0 }
            }
        ]).toArray();

        res.send(alquileresActivos);
    } catch (error) {
        console.error('Error al listar alquileres activos con cliente:', error);
        res.status(500).send('Error interno del servidor');
    };
}

// 5. Mostrar todas las reservas pendientes con los datos del cliente y el automóvil reservado

const EndPoint5 = async (req, res) => {
    try {
        const reservasPendientes = await reserva.aggregate([
            {
                $match: { res_estado: 'Pendiente' }
            },
            {
                $lookup: {
                    from: 'cliente',
                    localField: 'cli_id',
                    foreignField: '_id',
                    as: 'cliente'
                }
            },
            {
                $lookup: {
                    from: 'automovil',
                    localField: 'aut_id',
                    foreignField: '_id',
                    as: 'automovil'
                }
            },
            {
                $addFields: {
                    "cli_id": { $arrayElemAt: ['$cliente', 0] },
                    "aut_id": { $arrayElemAt: ['$automovil', 0] }
                }
            },
            {
                $unset: ['cliente', 'automovil']
            }
        ]).toArray();

        res.send(reservasPendientes);
    } catch (error) {
        console.error('Error al listar reservas pendientes con cliente y automóvil:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 6. Obtener los detalles del alquiler con el ID_Alquiler específico.

const EndPoint6 = async (req, res) => {
    const { idAlquiler } = req.params; // Supongo que el ID de alquiler se pasa como parámetro en la URL

    try {
        const result = await alquiler.findOne({ _id: new ObjectId(idAlquiler)});

        if (!result) {
            return res.status(404).json({ mensaje: 'Alquiler no encontrado' });
        }

        res.json(result);
    } catch (error) {
        console.error('Error al obtener detalles del alquiler:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// 7. Listar los empleados con el cargo de "Vendedor"

const EndPoint7 = async (req, res) => {
    try {
        const vendedores = await empleado.find({ emp_cargo: 'Vendedor' }).toArray();
        res.send(vendedores);
    } catch (error) {
        console.error('Error al listar vendedores:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 8. Mostrar la cantidad total de automóviles disponibles en cada sucursal.

const EndPoint8 = async (req, res) => {
    try {
        const resultado = await sucursal_automovil.aggregate([
            {
                $group: {
                    _id: '$suc_id',
                    total: { $sum: '$cantidad_disponible' }
                }
            }
        ]).toArray();

        const sucursales = await sucursal.find().toArray();

        // Formatea la respuesta con los nombres de las sucursales
        const respuesta = resultado.map((item) => {
            const sucursalNombre = sucursales.find((s) => s._id.equals(item._id));
            return {
                sucursal: sucursalNombre ? `${sucursalNombre.suc_nombre}, ${sucursalNombre.suc_direccion}` : "Desconocida",
                total: item.total
            };
        });

        res.send(respuesta);
    } catch (error) {
        console.error('Error al obtener la cantidad de automóviles disponibles en cada sucursal:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 9. Obtener el costo total de un alquiler específico.

const EndPoint9 = async (req, res) => {
    const { idAlquiler } = req.params;
    try {
        const alquilerCosto = await alquiler.findOne(
            { _id: new ObjectId(idAlquiler) },
            { projection: { alq_costoTotal: 1 } }
        );
        console.log(alquilerCosto);
        if (!alquilerCosto) {
            return res.status(404).json({ mensaje: 'Alquiler no encontrado' });
        }

        res.json({ costo_total: alquilerCosto.alq_costoTotal });
    } catch (error) {
        console.error('Error al obtener el costo total del alquiler:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// 10. Listar los clientes por el DNI Especifico

const EndPoint10 = async (req, res) => {
    const { dni } = req.params; // Obtén el DNI de los parámetros de la URL
    try {
        const clientes = await cliente.find({ cli_dni: dni }).toArray();

        if (clientes.length === 0) {
            return res.status(404).json({ mensaje: 'Clientes no encontrados para el DNI especificado' });
        }

        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener los clientes por DNI:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// 11. Mostrar todos los automoviles con capacidad mayor a 5 personas.

const EndPoint11 = async (req, res) => {
    try {
        const result = await automovil.find({ auto_capacidad: { $gt: 5 } }).toArray();

        res.send(result);
    } catch (error) {
        console.error('Error al buscar automóviles con capacidad mayor a 5 personas:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 12. Obtener los detalles del alquiler que tiene fecha de inicio en '2023-07-05'.

const EndPoint12 = async (req, res) => {
    try {
        // Realiza la consulta para obtener los detalles del alquiler con fecha de inicio '2023-07-05'
        const result = await alquiler.find({ alq_fechaInicio: { $eq: new Date('2023-07-05T00:00:00.000+00:00') } }).toArray();

        if (!result) {
            return res.status(404).json({ mensaje: 'Alquiler no encontrado con fecha de inicio en 2023-07-05' });
        }

        res.send(result);
    } catch (error) {
        console.error('Error al obtener detalles del alquiler con fecha de inicio en 2023-07-05:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 13. Listar las reservas pendientes realizadas por un cliente específico.

const EndPoint13 = async (req, res) => {
    const { clienteId } = req.params; // Obtén el ID del cliente específico de los parámetros de la URL
    try {
        const reservasPendientesCliente = await reserva.aggregate([
            {
                $match: {
                    $and: [
                        { cli_id: new ObjectId(clienteId) },
                        { res_estado: 'Pendiente' }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'cliente',
                    localField: 'cli_id',
                    foreignField: '_id',
                    as: 'cliente'
                }
            },
            {
                $lookup: {
                    from: 'automovil',
                    localField: 'aut_id',
                    foreignField: '_id',
                    as: 'automovil'
                }
            },
            {
                $addFields: {
                    "cli_id": { $arrayElemAt: ['$cliente', 0] },
                    "aut_id": { $arrayElemAt: ['$automovil', 0] }
                }
            },
            {
                $unset: ['cliente', 'automovil']
            }
        ]).toArray();

        res.send(reservasPendientesCliente);
    } catch (error) {
        console.error('Error al listar reservas pendientes realizadas por el cliente:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 14. Mostrar los empleados con cargo de "Gerente" o "Asistente".

const EndPoint14 = async (req, res) => {
    try {
        const empleados = await empleado.find({ emp_cargo: { $in: ["Gerente", "Asistente"] } }).toArray();
        const gerentes = empleados.filter(e => e.emp_cargo === "Gerente");
        const asistentes = empleados.filter(e => e.emp_cargo === "Asistente");
        res.json({ gerentes, asistentes });
    } catch (error) {
        console.error('Error al listar empleados con cargo de "Gerente" o "Asistente":', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 15. Obtener los datos de los clientes que realizaron al menos un alquiler.

const EndPoint15 = async (req, res) => {
    try {
        const clientesConAlquiler = await cliente.aggregate([
            {
                $lookup: {
                    from: 'alquiler',
                    localField: '_id',
                    foreignField: 'cli_id',
                    as: 'alquileres'
                }
            },
            {
                $match: {
                    'alquileres': { $exists: true, $not: { $size: 0 } }
                }
            }
        ]).toArray();

        res.send(clientesConAlquiler);
    } catch (error) {
        console.error('Error al obtener clientes con alquileres:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// 16. Listar todos los automóviles ordenados por marca y modelo.

const EndPoint16 = async (req, res) => {
    try {
        const automovilesOrdenados = await automovil.find().sort({ auto_marca: 1, auto_modelo: 1 }).toArray();
        res.send(automovilesOrdenados);
    } catch (error) {
        console.error('Error al listar automóviles ordenados por marca y modelo:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 17. Mostrar la cantidad total de automóviles en cada sucursal junto con su dirección.

const EndPoint17 = async (req, res) => {
    try {
        const resultado = await sucursal_automovil.aggregate([
            {
                $group: {
                    _id: '$suc_id',
                    total: { $sum: '$cantidad_disponible' }
                }
            }
        ]).toArray();

        const sucursales = await sucursal.find().toArray();

        // Formatea la respuesta con los nombres de las sucursales y sus direcciones
        const respuesta = resultado.map((item) => {
            const sucursalDatos = sucursales.find((s) => s._id.equals(item._id));
            return {
                sucursal: sucursalDatos ? `${sucursalDatos.suc_nombre}, ${sucursalDatos.suc_direccion}` : "Desconocida",
                total: item.total
            };
        });

        res.send(respuesta);
    } catch (error) {
        console.error('Error al obtener la cantidad de automóviles en cada sucursal:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 18. Obtener la cantidad total de alquileres registrados en la base de datos.

const EndPoint18 = async (req, res) => {
    try {
        const totalAlquileres = await alquiler.countDocuments();
        res.json({ totalAlquileres });
    } catch (error) {
        console.error('Error al obtener la cantidad total de alquileres:', error);
        res.status(500).send('Error interno del servidor');
    }
};

// 19. Mostrar los automóviles con capacidad igual a 5 personas y que estén disponibles.

const EndPoint19 = async (req, res) => {
    try {
        // Busca los IDs de automóviles con capacidad igual a 5 personas.
        const autosCapacidad5 = await automovil.find({ auto_capacidad: 5 }).toArray();

        // Obtiene los IDs de automóviles disponibles en sucursal_automovil.
        const autosDisponibles = await sucursal_automovil.aggregate([
            { $match: { cantidad_disponible: { $gt: 0 } } }, // Filtra solo aquellos con cantidad disponible mayor que 0.
            { $group: { _id: "$aut_ids" } }, // Agrupa por IDs de automóviles.
            { $unwind: "$_id" } // Desagrupa la matriz de IDs.
        ]).toArray();

        // Encuentra la intersección de IDs entre los autos con capacidad 5 y los autos disponibles.
        const autosFiltrados = autosCapacidad5.filter(auto => autosDisponibles.some(disponible => disponible._id.equals(auto._id)));

        res.send(autosFiltrados);
    } catch (error) {
        console.error('Error al buscar automóviles con capacidad igual a 5 personas y disponibles:', error);
        res.status(500).send('Error interno del servidor');
    }
}

// 20. Hacer un login de cliente mediante JWT

const EndPoint20 = async (req, res) => {
    try {
        const { cli_email } = req.body;
        const { cli_dni } = req.body;

        // Busca al cliente por su email o DNI (o puedes utilizar otro campo único)
        const user = await cliente.findOne({ $or: [{ cli_email }, { cli_dni }] });

        if (!user) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY , { expiresIn: "4h" });

        res.json({ msg: `Bienvenido Señor Cliente ${user.cli_nombre} ${user.cli_apellido}`, token });

    } catch (error) {
        console.log("Error en el login de cliente", error);
        res.status(500).send("Error interno del servidor");
    }
}

// 21. Listar los alquileres con fecha de inicio entre '2023-07-05' y '2023-07-10'.

const EndPoint21 = async (req, res) => {
    try {
        const fechaInicioMin = new Date('2023-07-05T00:00:00.000Z');
        const fechaInicioMax = new Date('2023-07-10T00:00:00.000Z');

        const alquileresEnRango = await alquiler.find({
            alq_fechaInicio: {
                $gte: fechaInicioMin,
                $lte: fechaInicioMax
            },
            alq_fechaFin: {
                $gte: fechaInicioMin,
                $lte: fechaInicioMax
            }
        }).toArray();

        res.send(alquileresEnRango);
    } catch (error) {
        console.error('Error al listar alquileres en el rango de fechas:', error);
        res.status(500).send('Error interno del servidor');
    }
};



export { EndPoint2, EndPoint3, EndPoint4, EndPoint5, EndPoint6, EndPoint7, EndPoint8, EndPoint9,
     EndPoint10, EndPoint11, EndPoint12, EndPoint13, EndPoint14, EndPoint15, EndPoint16, EndPoint17, EndPoint18, EndPoint19, EndPoint20, EndPoint21 }