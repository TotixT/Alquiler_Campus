import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const sucursal = db.collection("sucursal");

// Obtener todas las sucursales
async function getAllSucursales(req, res) {
    const sucursales = await sucursal.find({}).toArray();
    res.json(sucursales);
  }
  
  // Obtener sucursal por ID
  async function getSucursalById(req, res) {
    const { id } = req.params;
    const sucursalId = await sucursal.findOne({ _id: new ObjectId(id) });
    res.json(sucursalId);
  }
  
  // Crear un nueva sucursal
  async function createSucursal(req, res) {
    const newSucursal = req.body;
    const result = await sucursal.insertOne(newSucursal);
    res.json(result);
  }
  
  // Actualizar una sucursal
  async function updateSucursal(req, res) {
    const { id } = req.params;
    const updatedSucursal = req.body;
    const result = await sucursal.replaceOne({ _id: new ObjectId(id) }, updatedSucursal);
    res.json(result);
  }
  
  // Eliminar una sucursal
  async function deleteSucursal(req, res) {
    const { id } = req.params;
    const result = await sucursal.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: `Sucursal con ID ${id} eliminado` });
  }
  
  export { getAllSucursales, getSucursalById, createSucursal, updateSucursal, deleteSucursal };