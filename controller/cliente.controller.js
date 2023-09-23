import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const cliente = db.collection("cliente");

// Obtener todos los clientes
async function getAllClientes(req, res) {
    const clientes = await cliente.find({}).toArray();
    res.json(clientes);
  }
  
  // Obtener cliente por ID
  async function getClienteById(req, res) {
    const { id } = req.params;
    const clienteId = await cliente.findOne({ _id: new ObjectId(id) });
    res.json(clienteId);
  }
  
  // Crear un nuevo cliente
  async function createCliente(req, res) {
    const newCliente = req.body;
    const result = await cliente.insertOne(newCliente);
    res.json(result);
  }
  
  // Actualizar un cliente
  async function updateCliente(req, res) {
    const { id } = req.params;
    const updatedCliente = req.body;
    const result = await cliente.replaceOne({ _id: new ObjectId(id) }, updatedCliente);
    res.json(result);
  }
  
  // Eliminar un cliente
  async function deleteCliente(req, res) {
    const { id } = req.params;
    const result = await cliente.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: `Cliente con ID ${id} eliminado` });
  }
  
  export { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente };