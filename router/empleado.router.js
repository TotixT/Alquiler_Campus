import { Router } from "express";
import { getAllEmpleados, getEmpleadoById, createEmpleado, updateEmpleado, deleteEmpleado } from "../controller/empleado.controller.js"

const router = Router();

router.get("/All", getAllEmpleados);
router.get("/One/:id", getEmpleadoById);
router.post("/Create", createEmpleado);
router.put("/Update/:id", updateEmpleado);
router.delete("/Delete/:id", deleteEmpleado);

export default router;