import { Router } from "express";
import { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente } from "../controller/cliente.controller.js"

const router = Router();

router.get("/All", getAllClientes);
router.get("/One/:id", getClienteById);
router.post("/Create", createCliente);
router.put("/Update/:id", updateCliente);
router.delete("/Delete/:id", deleteCliente);

export default router;