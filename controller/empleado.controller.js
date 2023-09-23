import { ObjectId } from "mongodb";
import { client } from "../connection/connectionDB.js";
const db = client.db("alquiler");
const empleado = db.collection("empleado");

// Obtener todos los empleados
async function getAllEmpleados(req, res) {
    const empleados = await empleado.find({}).toArray();
    res.json(empleados);
  }
  
  // Obtener empleado por ID
  async function getEmpleadoById(req, res) {
    const { id } = req.params;
    const empleadoId = await empleado.findOne({ _id: new ObjectId(id) });
    res.json(empleadoId);
  }
  
  // Crear un nuevo empleado
  async function createEmpleado(req, res) {
    const newEmpleado = req.body;
    const result = await empleado.insertOne(newEmpleado);
    res.json(result);
  }
  
  // Actualizar un empleado
  async function updateEmpleado(req, res) {
    const { id } = req.params;
    const updatedEmpleado = req.body;
    const result = await empleado.replaceOne({ _id: new ObjectId(id) }, updatedEmpleado);
    res.json(result);
  }
  
  // Eliminar un empleado
  async function deleteEmpleado(req, res) {
    const { id } = req.params;
    const result = await empleado.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: `Cliente con ID ${id} eliminado` });
  }
  
  export { getAllEmpleados, getEmpleadoById, createEmpleado, updateEmpleado, deleteEmpleado };