import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const alquiler = db.collection("alquiler");

async function getAllAlquiler(req, res) {
    try {
        const Alquileres = await alquiler.find().toArray();
        res.json(Alquileres);
    } catch (error) {
        console.error('Error al listar Alquiler', error);
        res.status(500).json({ mensaje: 'Error al listar Alquiler' });
    }
}

async function getAlquilerById(req, res) {
    try {
        const { id } = req.params;
        const alquilerr = await alquiler.findOne({ _id: new ObjectId(id) });

        if (!alquilerr) {
            return res.status(404).json({ mensaje: 'Alquiler no encontrada' });
        }

        res.json(alquilerr);
    } catch (error) {
        console.error('Error al obtener alquiler por ID', error);
        res.status(500).json({ mensaje: 'Error al obtener alquiler por ID' });
    }
}

async function createAlquiler(req, res) {
    const { cli_id, aut_id, alq_fechaInicio, alq_fechaFin, alq_costoTotal, alq_estado } = req.body;

    // Verifica que cli_id y aut_id sean ObjectId válidos
    if (!ObjectId.isValid(cli_id) || !ObjectId.isValid(aut_id)) {
        return res.status(400).json({ message: 'ID de cliente o automóvil no válido' });
    }

    // Convierte las fechas a objetos Date
    const fechaInicio = new Date(alq_fechaInicio);
    const fechaFin = new Date(alq_fechaFin);

    // Crea el documento de alquiler
    const alquilerr = {
        cli_id: new ObjectId(cli_id),
        aut_id: new ObjectId(aut_id),
        alq_fechaInicio: fechaInicio,
        alq_fechaFin: fechaFin,
        alq_costoTotal,
        alq_estado,
    };
    try {
        const result = await alquiler.insertOne(alquilerr);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error al crear alquiler:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function updateAlquiler(req, res) {

    const { id } = req.params;
    const { cli_id, aut_id, alq_fechaInicio, alq_fechaFin, alq_costoTotal, alq_estado } = req.body;

    // Verifica que cli_id y aut_id sean ObjectId válidos
    if (!ObjectId.isValid(cli_id) || !ObjectId.isValid(aut_id)) {
        return res.status(400).json({ message: 'ID de cliente o automóvil no válido' });
    }

    // Convierte las fechas a objetos Date
    const fechaInicio = new Date(alq_fechaInicio);
    const fechaFin = new Date(alq_fechaFin);

    // Actualiza el documento de alquiler
    const alquilerActualizado = {
        cli_id: new ObjectId(cli_id),
        aut_id: new ObjectId(aut_id),
        alq_fechaInicio: fechaInicio,
        alq_fechaFin: fechaFin,
        alq_costoTotal,
        alq_estado,
    };

    try {
        const result = await alquiler.updateOne(
            { _id: new ObjectId(id) },
            { $set: alquilerActualizado }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Alquiler no encontrado' });
        }

        res.json({ message: 'Alquiler actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar alquiler:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

async function deleteAlquiler(req, res) {
    const { id } = req.params;
    try {
        const result = await alquiler.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Alquiler no encontrado' });
        }

        res.json({ message: 'Alquiler eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar alquiler:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export { getAllAlquiler, getAlquilerById, createAlquiler, updateAlquiler, deleteAlquiler }