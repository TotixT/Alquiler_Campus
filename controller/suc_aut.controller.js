import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const sucursal_automovil = db.collection("sucursal_automovil");
  
  export async function getAllSuc_Aut(req, res) {
    try {
      const sucursalAutomoviles = await sucursal_automovil.find().toArray();
      res.json(sucursalAutomoviles);
    } catch (error) {
      console.error('Error al listar sucursal_automovil', error);
      res.status(500).json({ mensaje: 'Error al listar sucursal_automovil' });
    }
  }
  
  export async function getSuc_AutById(req, res) {
    try {
      const { id } = req.params;
      const sucursalAutomovil = await sucursal_automovil.findOne({ _id: new ObjectId(id) });
  
      if (!sucursalAutomovil) {
        return res.status(404).json({ mensaje: 'Sucursal de automóvil no encontrada' });
      }
  
      res.json(sucursalAutomovil);
    } catch (error) {
      console.error('Error al obtener sucursal_automovil por ID', error);
      res.status(500).json({ mensaje: 'Error al obtener sucursal_automovil por ID' });
    }
  }

  export async function createSuc_Aut(req, res) {
    try {
      const { suc_id, aut_ids, cantidad_disponible } = req.body;
  
      // Valida que los IDs de sucursal y automóviles sean válidos (deben ser objetos ObjectId)
      const sucursalId = new ObjectId(suc_id);
      const automovilesIds = aut_ids.map((id) => new ObjectId(id));
  
      const resultado = await sucursal_automovil.insertOne({
        suc_id: sucursalId,
        aut_ids: automovilesIds,
        cantidad_disponible,
      });
  
      res.status(201).json(resultado);
    } catch (error) {
      console.error('Error al crear sucursal_automovil', error);
      res.status(500).json({ mensaje: 'Error al crear sucursal_automovil' });
    }
  }
  
  export async function updateSuc_Aut(req, res) {
    try {
      const { id } = req.params;
      const { suc_id, aut_ids, cantidad_disponible } = req.body;
  
      // Valida que los IDs de sucursal y automóviles sean válidos (deben ser objetos ObjectId)
      const sucursalId = new ObjectId(suc_id);
      const automovilesIds = aut_ids.map((id) => new ObjectId(id));
  
      const resultado = await sucursal_automovil.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            suc_id: sucursalId,
            aut_ids: automovilesIds,
            cantidad_disponible,
          },
        }
      );
  
      if (resultado.matchedCount === 0) {
        return res.status(404).json({ mensaje: 'Sucursal de automóvil no encontrada' });
      }
  
      res.json({ mensaje: 'Sucursal de automóvil actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar sucursal_automovil', error);
      res.status(500).json({ mensaje: 'Error al actualizar sucursal_automovil' });
    }
  }
  
  export async function deleteSuc_Aut(req, res) {
    try {
      const { id } = req.params;
  
      const resultado = await sucursal_automovil.deleteOne({ _id: new ObjectId(id) });
  
      if (resultado.deletedCount === 0) {
        return res.status(404).json({ mensaje: 'Sucursal de automóvil no encontrada' });
      }
  
      res.json({ mensaje: 'Sucursal de automóvil eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar sucursal_automovil', error);
      res.status(500).json({ mensaje: 'Error al eliminar sucursal_automovil' });
    }
  }
  