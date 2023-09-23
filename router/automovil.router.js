import { Router } from "express";
import { getAllAutomoviles, getAutomovilById, createAutomovil, updateAutomovil, deleteAutomovil } from "../controller/automovil.controller.js"

const router = Router();

router.get("/All", getAllAutomoviles);
router.get("/One/:id", getAutomovilById);
router.post("/Create", createAutomovil);
router.put("/Update/:id", updateAutomovil);
router.delete("/Delete/:id", deleteAutomovil);

export default router;