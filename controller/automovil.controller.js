import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const automovil = db.collection("automovil");

// Obtener todos los automoviles
async function getAllAutomoviles(req, res) {
    const automoviles = await automovil.find({}).toArray();
    res.json(automoviles);
  }
  
  // Obtener automovil por ID
  async function getAutomovilById(req, res) {
    const { id } = req.params;
    const automovilId = await automovil.findOne({ _id: new ObjectId(id) });
    res.json(automovilId);
  }
  
  // Crear un nuevo automovil
  async function createAutomovil(req, res) {
    const newAutomovil = req.body;
    const result = await automovil.insertOne(newAutomovil);
    res.json(result);
  }
  
  // Actualizar un automovil
  async function updateAutomovil(req, res) {
    const { id } = req.params;
    const updatedAutomovil = req.body;
    const result = await automovil.replaceOne({ _id: new ObjectId(id) }, updatedAutomovil);
    res.json(result);
  }
  
  // Eliminar un empleado
  async function deleteAutomovil(req, res) {
    const { id } = req.params;
    const result = await automovil.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: `Cliente con ID ${id} eliminado` });
  }
  
  export { getAllAutomoviles, getAutomovilById, createAutomovil, updateAutomovil, deleteAutomovil };