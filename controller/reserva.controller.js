import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const reserva = db.collection("reserva");

async function getAllReserva(req, res) {
    try {
        const reservas = await reserva.find().toArray();
        res.json(reservas);
    } catch (error) {
        console.error('Error al listar Reserva', error);
        res.status(500).json({ mensaje: 'Error al listar Reserva' });
    }
}

async function getReservaById(req, res) {
    try {
        const { id } = req.params;
        const reservaa = await reserva.findOne({ _id: new ObjectId(id) });

        if (!reservaa) {
            return res.status(404).json({ mensaje: 'Reserva no encontrada' });
        }

        res.json(reservaa);
    } catch (error) {
        console.error('Error al obtener reserva por ID', error);
        res.status(500).json({ mensaje: 'Error al obtener alquiler por ID' });
    }
}

async function createReserva(req, res) {
    const { cli_id, aut_id, res_fecha, res_fechaInicio, res_fechaFin, res_estado } = req.body;

    // Verifica que cli_id y aut_id sean ObjectId válidos
    if (!ObjectId.isValid(cli_id) || !ObjectId.isValid(aut_id)) {
        return res.status(400).json({ message: 'ID de cliente o automóvil no válido' });
    }

    // Convierte las fechas a objetos Date
    const fecha = new Date(res_fecha);
    const fechaInicio = new Date(res_fechaInicio);
    const fechaFin = new Date(res_fechaFin);

    // Crea el documento de alquiler
    const reservaa = {
        cli_id: new ObjectId(cli_id),
        aut_id: new ObjectId(aut_id),
        res_fecha: fecha,
        res_fechaInicio: fechaInicio,
        res_fechaFin: fechaFin,
        res_estado
    };
    try {
        const result = await reserva.insertOne(reservaa);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function updateReserva(req, res) {

    const { id } = req.params;
    const { cli_id, aut_id, res_fecha, res_fechaInicio, res_fechaFin, res_estado } = req.body;

    // Verifica que cli_id y aut_id sean ObjectId válidos
    if (!ObjectId.isValid(cli_id) || !ObjectId.isValid(aut_id)) {
        return res.status(400).json({ message: 'ID de cliente o automóvil no válido' });
    }

    // Convierte las fechas a objetos Date
    const fecha = new Date(res_fecha);
    const fechaInicio = new Date(res_fechaInicio);
    const fechaFin = new Date(res_fechaFin);

    // Actualiza el documento de alquiler
    const reservaActualizado = {
        cli_id: new ObjectId(cli_id),
        aut_id: new ObjectId(aut_id),
        res_fecha: fecha,
        res_fechaInicio: fechaInicio,
        res_fechaFin: fechaFin,
        res_estado
    };

    try {
        const result = await reserva.updateOne(
            { _id: new ObjectId(id) },
            { $set: reservaActualizado }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Reserva no encontrado' });
        }

        res.json({ message: 'Reserva actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar Reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function deleteReserva(req, res) {
    const { id } = req.params;
    try {
        const result = await reserva.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Reserva no encontrado' });
        }

        res.json({ message: 'Reserva eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar Reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export { getAllReserva, getReservaById, createReserva, updateReserva, deleteReserva }